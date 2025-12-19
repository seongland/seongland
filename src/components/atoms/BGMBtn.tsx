import React, { MouseEventHandler } from 'react'
import { IoPauseOutline, IoPlayOutline } from 'react-icons/io5'
import { useSound } from 'use-sound'

import { usePlayStore } from '@/store/'

export const BGMBtn: React.FC = () => {
  const { playing, setPlaying } = usePlayStore()
  const [start, { stop }] = useSound('/sound/loop.mp3', { loop: true })
  const togglePlay: MouseEventHandler = () => {
    setPlaying(!playing, stop)
    if (playing) stop()
    else start()
  }

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={playing ? 'Pause background music' : 'Play background music'}
      className="inline-flex hover:text-sky-500 text-2xl p-2 transition-colors cursor-pointer"
      onClick={togglePlay}
      title="Toggle background music">
      {playing ? <IoPauseOutline /> : <IoPlayOutline />}
    </span>
  )
}

export default BGMBtn
