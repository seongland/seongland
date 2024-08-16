import React from 'react'
import Typed from 'react-typed'

export const TypeTitle: React.FC = () => {
  return (
    <Typed
      className="text-4rem font-900 <lg:text-2.5rem text-center absolute top-41vh select-none"
      fadeOut={true}
      startDelay={100}
      typeSpeed={50}
      strings={[
        'Welcome',
        "I'm Seongae Cho",
        'Korean name is 조성래',
        "I'm styding how the world is built",
        'and trying to change it for the better',
        'focusing on AI.',
        'My results are below',
      ]}
    />
  )
}
