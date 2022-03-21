import React from 'react'
import { useSprings } from '@react-spring/three'
import { useDrag } from '@use-gesture/react'
import { useState } from 'react'
import { SpringCard } from '@/components/atoms/SpringCard'
import type { CardProp } from '@/components/atoms/SpringCard'

// Drop Constant
const BIG = 1.1
const START_SCALE = 1.5
const START_Y = -1000
const CARD_Y = 4
const DROP_DELAY = 100
const MAX_ANGLE = 5

// Drop Function
const from = () => ({ x: 0, rotation: 0, scale: START_SCALE, y: START_Y })
const end = (i: number) => ({
  x: 0,
  y: i * -CARD_Y,
  scale: 1,
  rotation: -MAX_ANGLE + Math.random() * MAX_ANGLE * 2,
  delay: i * DROP_DELAY,
})

// Gone Constant
const X_AWAY = 200
const VELOCITY = 0.2
const DELTA = 100
const MULTIPLE = 10
const TIMTOUT = 600
const FRICTION = 50
const LOW_TENSION = 200
const MID_TENSION = 500
const HIGH_TENSION = 800

const Deck: React.FC<{ cards: CardProp[] }> = ({ cards }) => {
  const [gone] = useState(() => new Set())
  const [props, set] = useSprings(cards.length, i => ({ ...end(i), from: from() }))

  // Drag Checker
  const bind = useDrag(({ args: [index], down, delta: [xDelta], direction: [xDir], velocity }) => {
    const trigger = velocity[0] > VELOCITY
    const dir = xDir > 0 ? 1 : -1
    if (!down && trigger) gone.add(index)

    // Gone Function
    set(i => {
      if (index !== i) return
      const isGone = gone.has(index)
      const x = isGone ? (X_AWAY + window.innerWidth) * dir : down ? xDelta : 0
      const rotation = xDelta / DELTA + (isGone ? dir * MULTIPLE * velocity[0] : 0)
      const scale = down ? BIG : 1
      return {
        x,
        rotation,
        scale,
        config: { friction: FRICTION, tension: down ? HIGH_TENSION : isGone ? LOW_TENSION : MID_TENSION },
      }
    })

    // Check all gone
    if (!down && gone.size === cards.length)
      setTimeout(() => {
        gone.clear()
        set(i => end(i))
      }, TIMTOUT)
  })

  // Map Card
  return (
    <>
      {props.map((spring, i) => {
        const card = cards[i]
        const props = bind(i)
        return <SpringCard spring={spring} card={card} key={i} props={props} />
      })}
    </>
  )
}

export default Deck
