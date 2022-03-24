import React from 'react'
import Image from 'next/image'

export const PageTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex absolute top-15vh" font="900">
      <div w="5vh" h="5vh" m="0.5">
        <Image layout="responsive" width="1" height="1" src="/seongland.svg" />
      </div>
      <span text="5vh center" w="full">
        {title}
      </span>
    </div>
  )
}
