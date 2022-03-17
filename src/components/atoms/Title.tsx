import React from 'react'

export const Title: React.FC<{ title: string }> = ({ title }) => {
  return <h1 style={{ position: 'absolute', top: '40vh', fontSize: '7vh', textAlign: 'center', width: '100vw' }}>{title}</h1>
}

export default Title
