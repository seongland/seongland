import React from 'react'
import Typed from 'react-typed'

export const TypeTitle: React.FC = () => {
  return (
    <Typed
      className="text-5rem <lg:text-2.5rem font-900 text-center absolute top-42.5vh select-none"
      fadeOut={true}
      startDelay={100}
      typeSpeed={50}
      strings={['Welcome to Seongland', 'Projects are below', 'Activities are below', 'Seongland']}
    />
  )
}
