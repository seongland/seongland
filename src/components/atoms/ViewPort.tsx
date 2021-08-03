import React, { useCallback } from 'react'
import { useStore } from '@/store/'

import styles from './viewport.module.css'

export default function ViewPort({ set }) {
  // Event
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) => set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }),
    []
  )
  const onScroll = useCallback(e => set({ top: e.target.scrollTop }), [])

  // Click Intersection
  const click = useStore(state => state.click)
  const onClick = useCallback(e => click(e), [click])
  return (
    <div className={styles.viewport} onScroll={onScroll} onClick={onClick} onMouseMove={onMouseMove}>
      <div className={styles.parallax} />
    </div>
  )
}
