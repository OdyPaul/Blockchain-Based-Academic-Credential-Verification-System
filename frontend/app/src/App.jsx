// src/App.jsx
import React from 'react'
import './App.css'
import Sidebar1 from './components/layouts/Sidebar1'
import Navbar from './components/layouts/navbar'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import StudentTable from './components/layouts/StudentTable'

function App() {
  return (
    <div className="app-container">
      {/* Sidebar - Fixed Left */}
      <aside className="Sidebar">
        <Sidebar1 />
      </aside>

      {/* Main Area (Navbar + Content) */}
      <div className="main-area">
        <header className="Navbar">
          <Navbar />

          <StudentTable/>
        </header>

        <main className="content-page">
          {/* Your actual content here */}
        </main>
      </div>
    </div>
  );
}


export default App
