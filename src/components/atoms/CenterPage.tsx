import React from 'react'

export const CenterPage: React.FC<{ top: string; children: React.ReactNode }> = ({ top, children }) => {
  return (
    <div className="flex absolute inset-0" justify="center" style={{ top }} h="100vh" w="100vw">
      <div className="flex items-center container" justify="center">
        {children}
      </div>
    </div>
  )
}

export default CenterPage
