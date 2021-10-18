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
        userData={{
          click: onClick,
          hover: onClick
            ? intersect => {
                if (intersect?.userData?.click) document.body.style.cursor = 'pointer'
                else document.body.style.cursor = 'default'
              }
            : null,
          leave: onClick ? () => (document.body.style.cursor = 'default') : null,
        }}
        anchorY={-1}
        fontSize={fontSize / 100}
      >
        {children}
      </Text>
    </a.mesh>
  )
}
