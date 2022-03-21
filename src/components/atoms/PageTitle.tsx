import React, { CSSProperties } from 'react'

export const titleStyle: CSSProperties = {
  fontFamily: 'Raleway',
  top: '30vh',
}

export const PageTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <h1 text="5vh center" w="full" className="absolute" style={titleStyle}>
      {title}
    </h1>
  )
}

export default PageTitle
