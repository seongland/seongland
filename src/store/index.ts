import create from 'zustand'

type Click = (e: MouseEvent) => void

type StoreState = {
  click: Click
  setClick: (click: Click) => void
}

export const useStore = create<StoreState>(set => ({
  click: () => ({}),
  setClick: (click: Click) => set({ click }),
}))
