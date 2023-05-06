import React from 'react'
import { to, animated } from '@react-spring/web'
import Image from 'next/image'

import type { SpringValue } from '@react-spring/web'
import type { ReactDOMAttributes as DragProps } from '@use-gesture/react/dist/declarations/src/types'

export type CardProp = {
  url: string
  theme: string
  background: string
  ratio: string
  color: string
  title: string
  bottom?: boolean
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

export const SpringCard: React.FC<{ card: CardProp; spring: SpringProp; props: DragProps; small?: boolean }> = ({
  card,
  spring,
  props,
  small = false,
}) => {
  return (
    <>
      <animated.div
        {...props}
        className={`transition min-h${small ? 5 : 10}rem <sm:min-h${small ? 2.5 : 5}rem`}
        style={{
          touchAction: 'pan-x',
          transform: to([spring.x, spring.y], (x, y) => `translate3d(${x}px,${y}px,0)`),
        }}>
        <animated.div
          w="full"
          h="full"
          text="center"
          className="flex rounded-xl max-h-40vh max-h-40vh"
          overflow="hidden"
          style={{
            outline: '1px solid transparent',
            background: `${card.theme}`,
            transform: to([spring.rotation, spring.scale], trans),
          }}>
          <a
            m="auto"
            className="flex"
            href={card.url}
            justify={card.bottom ? 'flex-end' : 'center'}
            select="none"
            flex="col-reverse">
            <Image
              fill
              alt={card.title}
              src={card.background}
              style={{
                objectFit: 'cover',
                backgroundPosition: 'center center',
                scale: `${card.ratio}`,
                overflow: 'visible',
                backgroundRepeat: 'no-repeat',
              }}
            />

            <div role="button" tabIndex={0} style={{ color: card.color }} m="4" z="1">
              <label text={small ? '1.5rem' : '2rem'} cursor="pointer" font="600">
                {card.title}
              </label>
              <div text={small ? '1rem' : '1.1rem'} font="400">
                {card.subtitle}
              </div>
            </div>
          </a>
        </animated.div>
      </animated.div>
    </>
  )
}

export default SpringCard
