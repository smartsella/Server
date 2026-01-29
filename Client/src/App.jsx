import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import './App.css'

const App = () => {
  // Removed blocking backend connection test
  // Backend connectivity will be verified when actual API calls are made

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App