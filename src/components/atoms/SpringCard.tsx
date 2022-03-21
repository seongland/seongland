import React from 'react'
import { ReactDOMAttributes as DragProps } from '@use-gesture/react'
import { animated, to } from '@react-spring/three'
import type { SpringValue } from '@react-spring/three'

export type CardProp = {
  url: string
  background: string
  icon: string
  ratio: string
  color: string
  title: string
  subtitle: string
}

export type SpringProp = {
  x: SpringValue<number>
  rotation: SpringValue<number>
  scale: SpringValue<number>
  y: SpringValue<number>
}

const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(10deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

export const SpringCard: React.FC<{ card: CardProp; spring: SpringProp; props: DragProps }> = ({ card, spring, props }) => {
  return (
    <div className="card-wrapper">
      {/* @ts-ignore */}
      <animated.div
        {...props}
        className="card"
        style={{ transform: to([spring.x, spring.y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
        <animated.div
          style={{
            background: `${card.background}`,
            width: '100vw',
            height: ' 50vh',
            marginLeft: '20%',
            marginRight: '20%',
            border: 'none',
            overflow: 'hidden',
            transform: to([spring.rotation, spring.scale], trans),
          }}>
          <div
            className="card-title-wrapper"
            style={{
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
            }}>
            <div
              role="button"
              tabIndex={0}
              className="card-title"
              style={{
                color: card.color,
                cursor: 'pointer',
              }}>
              <label>{card.title}</label>
              <div className="card-subtitle">{card.subtitle}</div>
            </div>
          </div>
        </animated.div>
      </animated.div>
    </div>
  )
}

export default SpringCard
