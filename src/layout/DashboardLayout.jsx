import React from 'react'

import Sidebar from '../pages/private/dashboard/components/Sidebar'
import Header from '../pages/private/dashboard/components/Header'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800 overflow-x-hidden">

      <Sidebar />

      <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">

        <Header />

        <div className="main-content flex flex-col flex-grow p-4">

          <Outlet />

        </div>
      </main>
    </div>
  )
}

export default DashboardLayout