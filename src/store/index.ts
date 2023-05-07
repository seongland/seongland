import { create } from 'zustand'

type PlayStore = {
  playing: boolean
  stop: () => void
  setPlaying: (play: boolean, stop: () => void) => void
}

export const usePlayStore = create<PlayStore>((set, get) => ({
  playing: false,
  stop: () => ({}),
  setPlaying: (play: boolean, stop: () => void) => {
    if (play) set({ stop })
    else get().stop()
    set({ playing: play })
  },
}))
