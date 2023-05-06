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
      text="hover:light-blue-500 2xl"
      p="2"
      className="inline-flex "
      transition="colors"
      onClick={togglePlay}
      title="Tottle dark mode">
      {playing ? <IoPauseOutline /> : <IoPlayOutline />}
    </span>
  )
}

export default BGMBtn
