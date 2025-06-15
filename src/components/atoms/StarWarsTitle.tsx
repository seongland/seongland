import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import type { Group } from 'three'

export const StarWarsTitle: React.FC = () => {
  const group = useRef<Group>(null)
  useFrame(() => {
    if (group.current && group.current.position.z < 0) group.current.position.z += 0.05
  })

  return (
    <group ref={group} position={[0, 0, -6]}>
      <Text
        color="white"
        anchorX="center"
        anchorY="middle"
        fontSize={0.6}
        maxWidth={10}
        lineHeight={1.2}
        font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json">
        {`Welcome\nI'm Seonglae Cho\ntrying to improve the world\nwith a focus on AI\nSee my CV and Portfolio ↗\nResults below↓`}
      </Text>
    </group>
  )
}

export default StarWarsTitle
