import React from 'react'
import Image from 'next/image'

import seongland from '~/public/seongland.png'

export const GridTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex absolute top-[15vh] font-black">
      <div className="mr-2" style={{ position: 'relative', width: '4.5vh', height: '4.5vh' }}>
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
      <span className="text-[4.5vh] text-center font-nasalization">{title}</span>
    </div>
  )
}

export default GridTitle
