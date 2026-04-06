import React from 'react'

import { Outlet } from 'react-router-dom'

import Header from '../components/Header'
import Footer from '../components/Footer'
import TabsSettings from '../components/TabsSettings'

const ProfileLayout = () => {
    return (
        <>
            <Header />
      

                <TabsSettings />

                <Outlet />


            <Footer />
        </>
    )
}

export default ProfileLayout