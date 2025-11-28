import React from 'react'
import DashboardProvider from './Provider'

function layout({children}) {
  return (
    <div>
        <DashboardProvider>
      {children}
      </DashboardProvider>
    </div>
  )
}

export default layout
