import React from 'react'
import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/three/RadialScene').then(m => m.RadialScene), { ssr: false })

const RadialPage: React.FC = () => {
  return <Scene />
}

export default RadialPage
