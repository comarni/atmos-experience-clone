import React from 'react'

export function Instructions() {
  return (
    <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: 'white',
        zIndex: 100,
        pointerEvents: 'none',
        opacity: 0.9,
        transition: 'opacity 1s ease'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          background: 'linear-gradient(45deg, #4fc3f7, #29b6f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          SKYJOURNEY
        </h1>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '2rem',
          color: '#ccc'
        }}>
          An immersive 3D flight experience
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(0,0,0,0.7)',
            padding: '0.8rem 1.5rem',
            borderRadius: '50px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
            <span style={{ fontSize: '1rem' }}>SCROLL TO FLY</span>
          </div>
          <p style={{
            fontSize: '0.9rem',
            color: '#888',
            maxWidth: '400px',
            lineHeight: '1.5'
          }}>
            Discover aviation facts as you navigate through procedural skies
          </p>
        </div>
      </div>
  )
}

export function LoadingScreen() {
  return (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          position: 'relative',
          marginBottom: '2rem'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            border: '3px solid rgba(79, 195, 247, 0.3)',
            borderTopColor: '#4fc3f7',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            height: '60%',
            border: '3px solid rgba(41, 182, 246, 0.3)',
            borderBottomColor: '#29b6f6',
            borderRadius: '50%',
            animation: 'spin 1.5s linear infinite reverse'
          }} />
        </div>
        <div style={{
          fontSize: '1.5rem',
          color: '#4fc3f7',
          letterSpacing: '4px',
          marginBottom: '1rem',
          textTransform: 'uppercase'
        }}>
          PREPARING FLIGHT
        </div>
        <div style={{
          width: '200px',
          height: '2px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '1px',
          overflow: 'hidden',
          marginTop: '1rem'
        }}>
          <div style={{
            width: '60%',
            height: '100%',
            background: 'linear-gradient(90deg, #4fc3f7, #29b6f6)',
            animation: 'loading 2s ease-in-out infinite'
          }} />
        </div>
        <style>{`
          @keyframes spin {
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes loading {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(200%); }
          }
        `}</style>
      </div>
  )
}