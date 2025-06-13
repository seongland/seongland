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
      className="inline-flex p-2 text-2xl transition-colors hover:text-sky-500"
      onClick={togglePlay}
      title="Toggle background music">
      {playing ? <IoPauseOutline /> : <IoPlayOutline />}
    </span>
  )
}

export default BGMBtn
