import { create } from 'zustand'

const useSceneStore = create((set) => ({
  // Model management
  models: [],
  selectedId: null,
  
  // Scene settings
  environment: 'city',
  showVideoBackground: false,
  shadows: true,
  cameraFov: 60,

  // Animation settings
  enableBounce: true,
  enableRotation: false,

  // Lighting controls
  lightPosition: [0, 8.5, 0],
  lightIntensity: 5,
  lightDistance: 25,
  shadowRadius: 50,
  contactShadowBlur: 30,
  contactShadowOpacity: 1,
  
  // Model actions
  addModel: (model) => set((state) => {
    // Check if model with this ID already exists
    const exists = state.models.find(m => m.id === model.id)
    if (exists) {
      return state // Don't add duplicate
    }
    return {
      models: [...state.models, model],
      selectedId: model.id
    }
  }),
  
  select: (id) => set(() => ({ selectedId: id })),
  
  updateSelected: (patch) => set((state) => ({
    models: state.models.map(m => 
      m.id === state.selectedId ? { ...m, ...patch } : m
    )
  })),
  
  removeSelected: () => set((state) => ({
    models: state.models.filter(m => m.id !== state.selectedId),
    selectedId: null
  })),
  
  // Scene settings actions
  setEnvironment: (env) => set(() => ({ environment: env })),
  setShadows: (val) => set(() => ({ shadows: val })),
  setCameraFov: (fov) => set(() => ({ cameraFov: fov })),
  setShowVideoBackground: (val) => set(() => ({ showVideoBackground: val })),

  // Animation actions
  setEnableBounce: (val) => set(() => ({ enableBounce: val })),
  setEnableRotation: (val) => set(() => ({ enableRotation: val })),

  // Lighting control actions
  setLightPosition: (pos) => set(() => ({ lightPosition: pos })),
  setLightIntensity: (intensity) => set(() => ({ lightIntensity: intensity })),
  setLightDistance: (distance) => set(() => ({ lightDistance: distance })),
  setShadowRadius: (radius) => set(() => ({ shadowRadius: radius })),
  setContactShadowBlur: (blur) => set(() => ({ contactShadowBlur: blur })),
  setContactShadowOpacity: (opacity) => set(() => ({ contactShadowOpacity: opacity }))
}))

export default useSceneStore