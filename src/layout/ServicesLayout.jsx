import React from 'react'

import Header from '../components/Header'
import Filters from '../components/Filters'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

const ServicesLayout = () => {
    return (
        <>
            <Header />

  
          {/*       <Filters /> */}

                <Outlet />
    
            <Footer />
        </>
    )
}

export default ServicesLayout