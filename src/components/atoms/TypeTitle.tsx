import React from 'react'
import Typed from 'react-typed'

export const TypeTitle: React.FC = () => {
  return (
    <Typed
      className="text-4rem font-900 <lg:text-2.5rem text-center absolute top-41vh select-none"
      fadeOut={true}
      startDelay={100}
      typeSpeed={50}
      strings={['Welcome', 'Projects are below', 'Activities are below', 'Seongland']}
    />
  )
}
