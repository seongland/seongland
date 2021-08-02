import create from 'zustand'
import { persist } from 'zustand/middleware'
import { Object3D } from 'three'

type StoreState = {
  intersect?: Object3D
  setIntersect: (Object3D: Object3D) => void
}

export const useStore = create<StoreState>(
  persist(set => ({ intersect: null, setIntersect: (intersect: Object3D) => set({ intersect }) }), { name: 'root' })
)
