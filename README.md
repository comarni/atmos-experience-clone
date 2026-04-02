# SkyJourney - Interactive 3D Flight Experience

An immersive scroll-driven 3D flight experience through procedural skies, inspired by ATMOS by Leeroy.

## 🚀 Live Demo

**[View on GitHub Pages](https://comarni.github.io/atmos-experience-clone/)**

## ✨ Features

- **Scroll-Driven Navigation**: Control your flight by scrolling
- **Procedural Skies**: Unique cloud formations generated algorithmically
- **Interactive Text Panels**: Discover aviation facts during your journey
- **Dynamic Camera**: Smooth camera movement following a Catmull-Rom spline
- **Wind Particle Effects**: Visual feedback based on scroll speed
- **Responsive Design**: Optimized for both desktop and mobile
- **Real-time 3D Graphics**: Built with Three.js and React Three Fiber

## 🛠️ Technology Stack

- **React** + **Vite** - Frontend framework and build tool
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **GSAP** + **ScrollTrigger** - Smooth animations and scroll control
- **Troika Three Text** - High-quality text rendering in WebGL

## 🎮 How to Use

1. **Open the live demo** in your browser
2. **Scroll down** to start the flight
3. **Watch as the airplane** follows the path through the clouds
4. **Read aviation facts** that appear along the journey
5. **Scroll faster** to see wind particle effects

## 📦 Local Development

```bash
# Clone the repository
git clone https://github.com/comarni/atmos-experience-clone.git
cd atmos-experience-clone

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🎨 Technical Implementation

### Core Components

1. **Spline Path System**: Uses Catmull-Rom curves for smooth flight paths
2. **Procedural Cloud Generator**: Creates organic cloud formations using sphere clusters
3. **Scroll Integration**: GSAP ScrollTrigger for precise scroll control
4. **Dynamic Camera**: Camera follows spline based on scroll position
5. **Text Rendering**: Troika for high-performance 3D text rendering
6. **Particle System**: Wind particles that respond to scroll speed

### Performance Optimizations

- **Instanced Geometry** for repeated elements
- **Level of Detail (LOD)** adjustments for mobile
- **Efficient shader materials**
- **RequestAnimationFrame** for smooth animations
- **Memory-efficient particle systems**

## 📱 Responsive Design

- **Desktop**: Full 3D experience with orbit controls
- **Mobile**: Simplified controls and optimized performance
- **Tablet**: Balanced experience with touch-friendly interactions

## 🔧 Customization

You can easily customize:

- **Flight path** by modifying `generateSplinePoints()` function
- **Cloud density** and appearance
- **Aviation facts** in the `AVIATION_FACTS` array
- **Colors and materials** throughout the scene
- **Scroll sensitivity** and animation speeds

## 🎯 Inspired By

This project is inspired by **[ATMOS by Leeroy](https://atmos.leeroy.ca/)**, an award-winning interactive 3D experience that showcases innovative WebGL techniques.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Leeroy Creative Agency** for the original ATMOS concept
- **Three.js community** for amazing 3D tools
- **React Three Fiber team** for the excellent React integration
- **GSAP team** for powerful animation libraries

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

---

**Enjoy your flight! ✈️**