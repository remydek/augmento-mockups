# AR Mockup Tool

A powerful web-based AR experience mockup tool built with React, Three.js, and Vite. This tool allows you to load 3D GLB/GLTF models and position them in an AR-like environment with realistic lighting and shadows.

![AR Mockup Tool](https://img.shields.io/badge/React-18-blue) ![Three.js](https://img.shields.io/badge/Three.js-Latest-green) ![Vite](https://img.shields.io/badge/Vite-Latest-yellow)

## 🚀 Features

- **GLB/GLTF Model Loading**: Upload and display 3D models with DRACO compression support
- **AR Camera Simulation**: 
  - Live camera feed background (requires HTTPS/localhost)
  - Device orientation controls (gyroscope support on mobile)
  - Fallback orbit controls for desktop
- **Realistic Rendering**:
  - Dynamic shadows and contact shadows
  - Environment-based lighting (multiple presets)
  - Physically correct materials and tone mapping
- **Model Manipulation**:
  - Position, rotation, and scale controls
  - Snap to ground functionality
  - Multi-model support with selection
- **Scene Controls**:
  - Adjustable camera FOV
  - Toggle shadows on/off
  - Switch between different environment presets
  - Toggle camera background

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Three.js** - 3D graphics engine
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and abstractions
- **Zustand** - State management
- **Vite** - Build tool and dev server

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/augmento-mockups.git
cd augmento-mockups
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 Usage

### Loading Models
1. Click **"Add Sample Model"** to load the default Damaged Helmet model
2. Click **"Upload GLB/GLTF"** to load your own 3D models
3. Select models from the dropdown to manipulate them

### Transform Controls
- **Position**: Use X, Y, Z sliders to move the model in 3D space
- **Rotation**: Adjust rotation in degrees for each axis
- **Scale**: Change the model size from 0.1x to 5x
- **Snap to Ground**: Automatically position model at ground level

### Scene Settings
- **Camera FOV**: Adjust the field of view (40° - 80°)
- **Environment**: Choose from various lighting presets (City, Sunset, Dawn, etc.)
- **Shadows**: Toggle realistic shadow rendering
- **Camera Background**: Enable/disable live camera feed (requires camera permissions)

### Camera Controls
- **Desktop**: Click and drag to orbit, scroll to zoom
- **Mobile**: 
  - Touch and drag to orbit
  - Pinch to zoom
  - Device orientation control (iOS requires permission)

## 🔒 Security & Permissions

### Camera Access
- Camera background requires HTTPS or localhost
- Users must grant camera permissions when prompted
- Fallback to default camera if rear camera unavailable

### Device Orientation (iOS)
- iOS 13+ requires explicit permission for gyroscope access
- Click the "Enable Gyro" button when prompted
- Falls back to touch controls if permission denied

## 📁 Project Structure

```
augmento-mockups/
├── src/
│   ├── components/
│   │   ├── Scene/          # 3D scene components
│   │   ├── Model/          # GLB model loader
│   │   ├── Camera/         # AR camera controller
│   │   ├── UI/             # Control panel and camera feed
│   │   └── Lighting/       # Lights and shadows
│   ├── store/              # Zustand state management
│   ├── styles/             # CSS styles
│   └── App.jsx             # Main app component
├── public/
│   └── models/             # GLB model files
└── vite.config.js          # Vite configuration
```

## 🚧 Known Limitations

- Camera access requires HTTPS in production (localhost works for development)
- Device orientation permissions required on iOS 13+
- Large GLB files may take time to load
- WebXR not yet implemented (planned feature)

## 🔮 Future Enhancements

- [ ] Ground plane detection with raycasting
- [ ] Touch gestures for model manipulation on mobile
- [ ] Persistent model arrangements (localStorage)
- [ ] HDR environment map support
- [ ] WebXR AR mode for supported devices
- [ ] Model animation playback
- [ ] Multiple file upload
- [ ] Export/import scene configurations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) for the amazing 3D library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for React integration
- [Khronos Group](https://github.com/KhronosGroup/glTF-Sample-Models) for sample GLB models

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
