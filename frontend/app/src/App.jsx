// src/App.jsx
import React from 'react'
import './App.css'
import Sidebar from './components/layouts/sidebar'

function App() {
  return (
    <div className="App">
      <Sidebar />
      <div style={{ marginLeft: '250px', padding: '20px' }}>
        <h1>Welcome to Your App</h1>
        <p>This is the main content area.</p>
      </div>
    </div>
  )
}

export default App
