import dynamic from 'next/dynamic'
import React from 'react'

const RainbowScene = dynamic(() => import('@/components/organisms/RainbowScene'), { ssr: false })

const RainbowPage: React.FC = () => {
  return <RainbowScene />
}

export default RainbowPage
