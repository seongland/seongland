import React, { CSSProperties } from 'react'
import Typed from 'react-typed'

export const titleStyle: CSSProperties = {
  fontSize: '6vw',
  textAlign: 'center',
  maxWidth: '90vw',
  fontFamily: 'Raleway',
}

export const Title: React.FC = () => {
  const style = { ...titleStyle }
  return (
    <Typed
      style={style}
      startDelay={100}
      typeSpeed={50}
      backSpeed={40}
      strings={['Welcome to Seongland', 'Projects are below', 'Activities are below', 'SeongLand']}
    />
  )
}

export default Title
