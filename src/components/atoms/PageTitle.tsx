import React from 'react'

export const PageTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <h1 text="5vh center" font="900" w="full" className="absolute top-15vh">
      {title}
    </h1>
  )
}
