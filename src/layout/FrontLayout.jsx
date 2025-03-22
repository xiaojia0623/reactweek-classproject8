import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'


const FrontLayout = () => {
  return (
    <>
    < Header />
    < Outlet />
    < Footer />
    </>
  )
}

export default FrontLayout
