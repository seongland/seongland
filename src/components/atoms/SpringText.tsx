import React, { useRef } from 'react'
import { a } from '@react-spring/three'
import { Text } from '@react-three/drei'

export default function SpringText({ children, position, color = 'white', fontSize = 400, onClick = null }) {
  const text = useRef(null)

  return (
    <a.mesh position={position}>
      <Text
        ref={text}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        color={color}
        userData={{ click: onClick }}
        anchorY={-1.3}
        fontSize={fontSize / 100}
      >
        {children}
      </Text>
    </a.mesh>
  )
}
