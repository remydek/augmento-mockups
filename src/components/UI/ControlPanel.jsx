import React, { useRef, useEffect } from 'react'
import useSceneStore from '../../store/useSceneStore'
import '../../styles/app.css'

export default function ControlPanel() {
  const fileInputRef = useRef(null)
  const {
    models,
    selectedId,
    environment,
    showVideoBackground,
    shadows,
    cameraFov,
    addModel,
    select,
    updateSelected,
    removeSelected,
    setEnvironment,
    setShadows,
    setCameraFov,
    setShowVideoBackground
  } = useSceneStore()
  
  const selectedModel = models.find(m => m.id === selectedId)
  
  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      const url = URL.createObjectURL(file)
      const newModel = {
        id: `model-${Date.now()}`,
        name: file.name,
        url: url,
        position: [0, 0, -2],
        rotation: [0, 0, 0],
        scale: 1
      }
      addModel(newModel)
    }
  }
  
  // Add default model
  const addDefaultModel = () => {
    const newModel = {
      id: `model-${Date.now()}`,
      name: 'DamagedHelmet.glb',
      url: '/models/DamagedHelmet.glb',
      position: [0, 0.5, -2],
      rotation: [0, 0, 0],
      scale: 1
    }
    addModel(newModel)
  }
  
  // Update position
  const updatePosition = (axis, value) => {
    if (!selectedModel) return
    const newPosition = [...selectedModel.position]
    newPosition[axis] = parseFloat(value)
    updateSelected({ position: newPosition })
  }
  
  // Update rotation (convert degrees to radians)
  const updateRotation = (axis, value) => {
    if (!selectedModel) return
    const newRotation = [...selectedModel.rotation]
    newRotation[axis] = (parseFloat(value) * Math.PI) / 180
    updateSelected({ rotation: newRotation })
  }
  
  // Update scale
  const updateScale = (value) => {
    if (!selectedModel) return
    updateSelected({ scale: parseFloat(value) })
  }
  
  // Snap to ground
  const snapToGround = () => {
    if (!selectedModel) return
    const newPosition = [...selectedModel.position]
    newPosition[1] = 0
    updateSelected({ position: newPosition })
  }
  
  return (
    <div className="control-panel">
      <h2>AR Mockup Tool</h2>
      
      {/* Model Loading */}
      <div className="control-section">
        <h3>Load Model</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button onClick={() => fileInputRef.current?.click()}>
          Upload GLB/GLTF
        </button>
        <button onClick={addDefaultModel}>
          Add Sample Model
        </button>
      </div>
      
      {/* Model Selection */}
      {models.length > 0 && (
        <div className="control-section">
          <h3>Select Model</h3>
          <select value={selectedId || ''} onChange={(e) => select(e.target.value)}>
            <option value="">-- Select Model --</option>
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          {selectedId && (
            <button onClick={removeSelected} className="remove-btn">
              Remove Selected
            </button>
          )}
        </div>
      )}
      
      {/* Transform Controls */}
      {selectedModel && (
        <div className="control-section">
          <h3>Transform</h3>
          
          <div className="control-group">
            <label>Position</label>
            <div className="axis-controls">
              <div>
                <span>X:</span>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={selectedModel.position[0]}
                  onChange={(e) => updatePosition(0, e.target.value)}
                />
                <span>{selectedModel.position[0].toFixed(1)}</span>
              </div>
              <div>
                <span>Y:</span>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={selectedModel.position[1]}
                  onChange={(e) => updatePosition(1, e.target.value)}
                />
                <span>{selectedModel.position[1].toFixed(1)}</span>
              </div>
              <div>
                <span>Z:</span>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={selectedModel.position[2]}
                  onChange={(e) => updatePosition(2, e.target.value)}
                />
                <span>{selectedModel.position[2].toFixed(1)}</span>
              </div>
            </div>
            <button onClick={snapToGround}>Snap to Ground</button>
          </div>
          
          <div className="control-group">
            <label>Rotation (degrees)</label>
            <div className="axis-controls">
              <div>
                <span>X:</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={(selectedModel.rotation[0] * 180) / Math.PI}
                  onChange={(e) => updateRotation(0, e.target.value)}
                />
                <span>{Math.round((selectedModel.rotation[0] * 180) / Math.PI)}°</span>
              </div>
              <div>
                <span>Y:</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={(selectedModel.rotation[1] * 180) / Math.PI}
                  onChange={(e) => updateRotation(1, e.target.value)}
                />
                <span>{Math.round((selectedModel.rotation[1] * 180) / Math.PI)}°</span>
              </div>
              <div>
                <span>Z:</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={(selectedModel.rotation[2] * 180) / Math.PI}
                  onChange={(e) => updateRotation(2, e.target.value)}
                />
                <span>{Math.round((selectedModel.rotation[2] * 180) / Math.PI)}°</span>
              </div>
            </div>
          </div>
          
          <div className="control-group">
            <label>Scale</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={selectedModel.scale}
              onChange={(e) => updateScale(e.target.value)}
            />
            <span>{selectedModel.scale.toFixed(1)}x</span>
          </div>
        </div>
      )}
      
      {/* Scene Settings */}
      <div className="control-section">
        <h3>Scene Settings</h3>
        
        <div className="control-group">
          <label>Camera FOV</label>
          <input
            type="range"
            min="40"
            max="80"
            step="1"
            value={cameraFov}
            onChange={(e) => setCameraFov(Number(e.target.value))}
          />
          <span>{cameraFov}°</span>
        </div>
        
        <div className="control-group">
          <label>Environment</label>
          <select value={environment} onChange={(e) => setEnvironment(e.target.value)}>
            <option value="city">City</option>
            <option value="sunset">Sunset</option>
            <option value="dawn">Dawn</option>
            <option value="night">Night</option>
            <option value="warehouse">Warehouse</option>
            <option value="forest">Forest</option>
            <option value="apartment">Apartment</option>
            <option value="studio">Studio</option>
            <option value="park">Park</option>
            <option value="lobby">Lobby</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={shadows}
              onChange={(e) => setShadows(e.target.checked)}
            />
            Shadows
          </label>
        </div>
        
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showVideoBackground}
              onChange={(e) => setShowVideoBackground(e.target.checked)}
            />
            Camera Background
          </label>
        </div>
      </div>
    </div>
  )
}