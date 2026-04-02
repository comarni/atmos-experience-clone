import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Sky, Stars, Float, Instance, Instances, OrbitControls, PerspectiveCamera, ScrollControls, Scroll, useScroll, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Instructions, LoadingScreen } from './components/Instructions'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Aviation facts to display during the journey
const AVIATION_FACTS = [
  "The Wright Brothers' first flight in 1903 lasted just 12 seconds and covered 120 feet.",
  "A Boeing 747 has about 6 million parts, half of which are fasteners.",
  "The world's busiest airport is Hartsfield-Jackson Atlanta International Airport.",
  "The Concorde could fly at twice the speed of sound (Mach 2).",
  "The black box flight recorder is actually bright orange for visibility.",
  "Airplanes can fly because of Bernoulli's principle: faster air over the wing creates lower pressure.",
  "The longest non-stop commercial flight is Singapore Airlines' Singapore to New York route (18+ hours).",
  "Jet fuel is similar to kerosene and has a freezing point of -40°C.",
  "The world's largest passenger aircraft is the Airbus A380 with capacity for 853 passengers.",
  "Pilots and co-pilots are required to eat different meals to avoid food poisoning affecting both."
]

// Generate random spline points for the flight path
function generateSplinePoints(count = 15) {
  const points = []
  for (let i = 0; i < count; i++) {
    points.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 40, // X variation
        Math.sin(i * 0.5) * 10 + (Math.random() - 0.5) * 5, // Y wave pattern
        -i * 30 // Progressive Z
      )
    )
  }
  return points
}

// Procedural cloud generator
function Cloud({ position, scale, opacity = 0.9 }) {
  const group = useRef()
  
  useFrame((state) => {
    if (group.current) {
      // Gentle floating animation
      group.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 0.5 + position.x) * 0.2
      group.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Cloud made of multiple spheres */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 2
          ]}
          scale={[0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={opacity}
            roughness={0.8}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  )
}

// Simple airplane model
function Airplane({ spline, progress }) {
  const planeRef = useRef()
  const propellerRef = useRef()
  
  useFrame((state) => {
    if (planeRef.current && spline) {
      // Get position along spline based on scroll progress
      const point = spline.getPoint(progress)
      const tangent = spline.getTangent(progress)
      
      // Update plane position and rotation
      planeRef.current.position.copy(point)
      
      // Align plane with spline direction
      if (tangent.length() > 0) {
        planeRef.current.lookAt(point.clone().add(tangent))
      }
      
      // Gentle bobbing animation
      planeRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.1
      
      // Rotate propeller
      if (propellerRef.current) {
        propellerRef.current.rotation.z += 0.3
      }
    }
  })

  return (
    <group ref={planeRef}>
      {/* Fuselage */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.25, 3, 8]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.5} roughness={0.7} />
      </mesh>
      
      {/* Wings */}
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[5, 0.1, 0.8]} />
        <meshStandardMaterial color="#34495e" metalness={0.4} roughness={0.6} />
      </mesh>
      
      {/* Tail */}
      <mesh position={[-1.2, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.1]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.5} roughness={0.7} />
      </mesh>
      
      {/* Propeller */}
      <mesh ref={propellerRef} position={[1.6, 0, 0]}>
        <boxGeometry args={[0.1, 1.2, 0.05]} />
        <meshStandardMaterial color="#e74c3c" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Cockpit */}
      <mesh position={[1, 0.2, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#3498db" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

// Wind particles system
function WindParticles({ count = 100, visible = true }) {
  const particlesRef = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (particlesRef.current) {
      // Animate particles moving in wind-like pattern
      particlesRef.current.rotation.y += 0.002
      particlesRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={visible ? 0.6 : 0}
        sizeAttenuation
      />
    </points>
  )
}

// Text panel for aviation facts
function TextPanel({ position, fact, index, total }) {
  const textRef = useRef()
  const [visible, setVisible] = useState(false)
  
  useFrame((state) => {
    if (textRef.current) {
      // Make text always face camera
      textRef.current.lookAt(state.camera.position)
      
      // Gentle floating animation
      textRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.1
      
      // Check visibility based on camera distance
      const distance = textRef.current.position.distanceTo(state.camera.position)
      setVisible(distance < 40)
    }
  })

  return (
    <group position={position}>
      {/* Background plane for text */}
      <mesh>
        <planeGeometry args={[8, 3]} />
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={visible ? 0.8 : 0}
          roughness={0.8}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Text */}
      <Text
        ref={textRef}
        position={[0, 0, 0.1]}
        fontSize={0.4}
        color="#4fc3f7"
        anchorX="center"
        anchorY="middle"
        maxWidth={7}
        textAlign="center"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {fact}
      </Text>
      
      {/* Progress indicator */}
      <Text
        position={[0, -1.5, 0.1]}
        fontSize={0.3}
        color="#888"
        anchorX="center"
        anchorY="middle"
      >
        {index + 1} / {total}
      </Text>
    </group>
  )
}

// Main scene component
function Scene() {
  const { camera } = useThree()
  const scroll = useScroll()
  const [spline, setSpline] = useState(null)
  const [windVisible, setWindVisible] = useState(false)
  const lastScrollTime = useRef(Date.now())
  
  // Generate spline on mount
  useEffect(() => {
    const points = generateSplinePoints()
    const curve = new THREE.CatmullRomCurve3(points)
    setSpline(curve)
    
    // Position camera at start of spline
    if (points.length > 0) {
      camera.position.copy(points[0])
      camera.position.y += 5
      camera.position.z += 10
      camera.lookAt(points[0])
    }
  }, [camera])
  
  useFrame((state) => {
    // Calculate scroll progress (0 to 1)
    const progress = scroll.offset
    
    // Update wind visibility based on scroll speed
    const now = Date.now()
    const scrollDelta = Math.abs(scroll.delta)
    if (scrollDelta > 0.01 && now - lastScrollTime.current < 100) {
      setWindVisible(true)
    } else {
      setWindVisible(false)
    }
    lastScrollTime.current = now
    
    // Move camera along spline based on scroll
    if (spline) {
      const cameraPoint = spline.getPoint(progress)
      const lookPoint = spline.getPoint(Math.min(progress + 0.05, 1))
      
      // Smooth camera movement with GSAP
      gsap.to(camera.position, {
        x: cameraPoint.x,
        y: cameraPoint.y + 8,
        z: cameraPoint.z + 15,
        duration: 0.5,
        ease: "power2.out"
      })
      
      camera.lookAt(lookPoint)
    }
    
    // Animate sky color based on progress
    const skyColor = new THREE.Color()
    skyColor.setHSL(0.6 + progress * 0.2, 0.7, 0.5)
    state.scene.background = skyColor
  })
  
  // Generate cloud positions along spline
  const cloudPositions = useMemo(() => {
    if (!spline) return []
    const positions = []
    for (let i = 0; i < 30; i++) {
      const t = i / 30
      const point = spline.getPoint(t)
      positions.push({
        position: [
          point.x + (Math.random() - 0.5) * 20,
          point.y + 5 + Math.random() * 10,
          point.z + (Math.random() - 0.5) * 20
        ],
        scale: 2 + Math.random() * 4,
        opacity: 0.7 + Math.random() * 0.3
      })
    }
    return positions
  }, [spline])
  
  // Generate text panel positions along spline
  const textPositions = useMemo(() => {
    if (!spline) return []
    const positions = []
    const factCount = Math.min(AVIATION_FACTS.length, 8)
    for (let i = 0; i < factCount; i++) {
      const t = (i + 1) / (factCount + 1)
      const point = spline.getPoint(t)
      positions.push({
        position: [
          point.x + (Math.random() - 0.5) * 15,
          point.y + 3,
          point.z
        ],
        fact: AVIATION_FACTS[i],
        index: i
      })
    }
    return positions
  }, [spline])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight
        intensity={0.3}
        groundColor="#1a1a2e"
      />
      
      {/* Sky gradient */}
      <Sky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0}
        azimuth={0.25}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        rayleigh={2}
        turbidity={10}
      />
      
      {/* Stars for night effect */}
      <Stars
        radius={300}
        depth={60}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      
      {/* Flight path visualization */}
      {spline && (
        <mesh>
          <tubeGeometry args={[spline, 100, 0.3, 8, false]} />
          <meshBasicMaterial
            color="#4fc3f7"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Airplane */}
      {spline && (
        <Airplane
          spline={spline}
          progress={scroll.offset}
        />
      )}
      
      {/* Clouds */}
      {cloudPositions.map((cloud, i) => (
        <Cloud
          key={i}
          position={cloud.position}
          scale={cloud.scale}
          opacity={cloud.opacity}
        />
      ))}
      
      {/* Wind particles */}
      <WindParticles visible={windVisible} />
      
      {/* Text panels with aviation facts */}
      {textPositions.map((text, i) => (
        <TextPanel
          key={i}
          position={text.position}
          fact={text.fact}
          index={text.index}
          total={textPositions.length}
        />
      ))}
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#87CEEB', 100, 300]} />
    </>
  )
}

// Scroll progress indicator
function ScrollProgress() {
  const scroll = useScroll()
  
  return (
    <Html fullscreen>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '10px 15px',
        borderRadius: '20px',
        fontSize: '14px',
        color: '#4fc3f7',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '100px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${scroll.offset * 100}%`,
            height: '100%',
            background: '#4fc3f7',
            transition: 'width 0.1s ease'
          }} />
        </div>
        <span>{(scroll.offset * 100).toFixed(0)}%</span>
      </div>
    </Html>
  )
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  
  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => {
      setIsLoaded(true)
      // Hide instructions after 3 seconds
      setTimeout(() => setShowInstructions(false), 3000)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <>
      <Canvas shadows>
        <ScrollControls pages={3} damping={0.1}>
          <Scene />
          <Scroll html>
            {/* This creates scrollable space */}
            <div style={{
              height: '300vh',
              position: 'relative'
            }}>
              {/* Empty div for scroll space */}
            </div>
          </Scroll>
        </ScrollControls>
        <PerspectiveCamera makeDefault position={[0, 10, 30]} fov={60} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
      
      <ScrollProgress />
      
      {/* Loading screen */}
      {!isLoaded && <LoadingScreen />}
      
      {/* Instructions overlay */}
      {showInstructions && isLoaded && <Instructions />}
    </>
  )
}

export default App