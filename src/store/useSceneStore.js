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
  
  // Model actions
  addModel: (model) => set((state) => ({ 
    models: [...state.models, model], 
    selectedId: model.id 
  })),
  
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
  setShowVideoBackground: (val) => set(() => ({ showVideoBackground: val }))
}))

export default useSceneStore