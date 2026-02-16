import React from 'react'
import { to, animated } from '@react-spring/web'
import Image from 'next/image'

import type { SpringValue } from '@react-spring/web'
import type { ReactDOMAttributes as DragProps } from '@use-gesture/react/dist/declarations/src/types'
import type { Card } from '~/scripts/cards'

export type SpringProp = {
  x: SpringValue<number>
  rotation: SpringValue<number>
  scale: SpringValue<number>
  y: SpringValue<number>
}

const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(10deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

export const SpringCard: React.FC<{ card: Card; spring: SpringProp; props: DragProps; small?: boolean }> = ({
  card,
  spring,
  props,
  small = false,
}) => {
  return (
    <animated.div
      {...props}
      className={`transition ${small ? 'min-h-20' : 'min-h-40'} ${small ? 'max-sm:min-h-10' : 'max-sm:min-h-20'}`}
      style={{
        touchAction: 'pan-x',
        transform: to([spring.x, spring.y], (x, y) => `translate3d(${x}px,${y}px,0)`),
      }}>
      <animated.div
        className="flex rounded-xl max-h-[40vh] w-full h-full text-left overflow-hidden"
        style={{
          outline: '1px solid transparent',
          background: `${card.theme}`,
          transform: to([spring.rotation, spring.scale], trans),
        }}>
        <a
          className="flex m-auto justify-center select-none flex-col-reverse"
          href={card.url}
          style={{ position: 'relative' }}>
          <Image
            fill
            alt={card.alt ?? card.title}
            src={card.image.src as string}
            placeholder="blur"
            blurDataURL={card.image.blurDataURL || card.image.src}
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              30vw"
            style={{
              objectFit: 'cover',
              backgroundPosition: 'center center',
              scale: `${card.ratio}`,
              overflow: 'visible',
              backgroundRepeat: 'no-repeat',
            }}
          />

          <div
            role="button"
            tabIndex={0}
            aria-label={card.title}
            className="m-4 z-[1]"
            style={{ color: card.color, textShadow: `0 0 1px ${card.color}` }}>
            <label className={`cursor-pointer p-3 font-semibold ${small ? 'text-2xl' : 'text-[2rem]'}`}>{card.title}</label>
            <div className={`font-medium p-3 leading-7 ${small ? 'text-base' : 'text-xl'}`}>{card.subtitle}</div>
          </div>
        </a>
      </animated.div>
    </animated.div>
  )
}

export default SpringCard
