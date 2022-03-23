import React from 'react'
import { ReactDOMAttributes as DragProps } from '@use-gesture/react'
import { to, animated } from '@react-spring/web'
import type { SpringValue } from '@react-spring/web'

export type CardProp = {
  url: string
  background: string
  icon: string
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
          className="rounded-xl max-h-40vh max-h-40vh"
          overflow="hidden"
          style={{
            background: `${card.background}`,
            transform: to([spring.rotation, spring.scale], trans),
          }}>
          <a
            className="items-center flex"
            w="full"
            h="full"
            flex="col-reverse"
            href={card.url}
            justify={card.bottom ? 'flex-end' : 'center'}
            select="none"
            cursor="pointer"
            style={{
              background: `url("${card.icon}")`,
              backgroundPosition: 'center center',
              backgroundSize: `${card.ratio}`,
              backgroundRepeat: 'no-repeat',
            }}>
            <div role="button" tabIndex={0} style={{ color: card.color }} m="4">
              <label text={small ? '1.5rem' : '2rem'} cursor="pointer" font="600">
                {card.title}
              </label>
              <div text={small ? '1rem' : '1.1rem'}>{card.subtitle}</div>
            </div>
          </a>
        </animated.div>
      </animated.div>
    </>
  )
}

export default SpringCard
