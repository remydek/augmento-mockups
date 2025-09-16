import React from 'react'
import SceneRoot from './components/Scene/SceneRoot'
import CameraFeed from './components/UI/CameraFeed'
import ControlPanel from './components/UI/ControlPanel'
import './App.css'

function App() {
  return (
    <div className="app">
      <CameraFeed />
      <SceneRoot />
      <ControlPanel />
    </div>
  )
}

export default App
