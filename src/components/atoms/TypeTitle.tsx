import React from 'react'
import Typed from 'react-typed'

export const TypeTitle: React.FC = () => {
  return (
    <Typed
      className="text-4rem font-900 <lg:text-2.5rem text-center absolute top-41vh select-none font-nasalization"
      fadeOut={true}
      startDelay={100}
      typeSpeed={25}
      strings={[
        'Welcome',
        "I'm Seonglae Cho",
        'trying to improve the world',
        'with a focus on AI',
        'See my CV and Portfolio ↗',
        'Results below↓',
      ]}
    />
  )
}
