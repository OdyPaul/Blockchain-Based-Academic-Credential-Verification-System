// src/App.jsx
import React from 'react'
import './App.css'
import Sidebar from './components/layouts/sidebar'
import Navbar from './components/layouts/navbar'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

function App() {
  return (
    <div className="App">
      <Sidebar />
      
      <Navbar/>
    </div>
  )
}

export default App
