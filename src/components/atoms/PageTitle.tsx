import React from 'react'
import Image from 'next/image'

import seongland from '~/public/seongland.png'

export const PageTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex absolute top-15vh" font="900">
      <div w="5vh" h="5vh" m="r-2" style={{ position: 'relative' }}>
        <Image
          fill
          alt={title}
          src={seongland.src}
          placeholder="blur"
          loading="lazy"
          blurDataURL={seongland.blurDataURL}
          sizes="(max-width: 768px) 50vw,
              (max-width: 1200px) 25vw,
              20vw"
        />
      </div>
      <span text="5vh center" w="full">
        {title}
      </span>
    </div>
  )
}
