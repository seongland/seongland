import React from 'react'
import { useSprings } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { useState } from 'react'
import { SpringCard } from '@/components/atoms/SpringCard'
import type { CardProp } from '@/components/atoms/SpringCard'

const CardGrid: React.FC<{
  cards: CardProp[]
  timeout?: number
  speed?: number
  friction?: number
  offset?: number
  magnify?: { start: number; select: number }
  tension?: { up: number; down: number }
  angle?: number
  spin?: { divisor: number; multiplier: number }
  small?: boolean
}> = ({
  cards,
  tension = { up: 800, down: 100 },
  friction = 50,
  timeout = 1000,
  offset = 1000,
  angle = 3,
  speed = 0.2,
  magnify = { start: 1.5, select: 1.1 },
  spin = { divisor: 100, multiplier: 10 },
}) => {
  // Drop Function
  const from = () => ({ x: 0, rotation: 0, scale: magnify.start, y: 0 })
  const end = () => ({
    x: 0,
    y: 0,
    scale: 1,
    rotation: -angle + Math.random() * angle * 2,
  })
  const [gone] = useState(() => new Set())
  const [props, set] = useSprings(cards.length, () => ({ ...end(), from: from() }))

  // Drag Checker
  const bind = useDrag(({ args: [index], down, delta: [xDelta], direction: [xDir], velocity }) => {
    const trigger = velocity[0] > speed
    const dir = xDir > 0 ? 1 : -1
    if (!down && trigger) gone.add(index)

    // Gone Function
    set(i => {
      if (index !== i) return
      const isGone = gone.has(index)
      const x = isGone ? (offset + window.innerWidth) * dir : down ? xDelta : 0
      const rotation = xDelta / spin.divisor + (isGone ? dir * spin.multiplier * velocity[0] : 0)
      const scale = down ? magnify.select : 1
      return {
        x,
        rotation,
        scale,
        config: { friction, tension: down ? tension.up : tension.down },
      }
    })

    // Check all gone
    if (!down && gone.size === cards.length)
      setTimeout(() => {
        gone.clear()
        set(() => end())
      }, timeout)
  })

  // Map Card
  return (
    <div
      className="grid gap-10 <sm:gap-5 <sm:grid-cols-1 <md:grid-cols-3 <lg:grid-cols-3 grid-cols-3 max-w-11/12"
      w="full"
      h="50vh">
      {props.map((spring, i) => {
        const card = cards[i]
        const props = bind(i)
        return <SpringCard spring={spring} card={card} key={i} props={props} />
      })}
    </div>
  )
}

export default CardGrid
