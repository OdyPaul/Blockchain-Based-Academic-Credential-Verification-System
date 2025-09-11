"use client"

import React from "react"
import CIcon from "@coreui/icons-react"
import { cilBell, cilSettings,cilUser  } from "@coreui/icons"
import './css/navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div className="container-fluid ms-5">
        {/* Search Form */}
        <form className="d-flex ms-3">
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button className="btn btn-outline-dark mx-3" type="submit">
            Search
          </button>
        </form>



        {/* Right Side */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown mx-2">
      <button
        className="btn btn-light border-0 dropdown-toggle"
        id="userDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <CIcon icon={cilUser} size="lg" />
      </button>
<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
  {/* User Role/Name Placeholder */}
  <li className="dropdown-item fw-bold text-primary">👨‍💼 Admin</li>
  <li><hr className="dropdown-divider" /></li>

  {/* Existing Options */}
  <li className="dropdown-item">👤 My Profile</li>
  <li className="dropdown-item">🔒 Logout</li>
  <li className="dropdown-item">⚙️ Settings</li>
</ul>

    </li>
            {/* Notifications Dropdown */}
            <li className="nav-item dropdown mx-2">
              <button
                className="btn btn-light border-0 dropdown-toggle"
                id="notificationsDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <CIcon icon={cilBell} size="lg" />
               
              </button>

              
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="notificationsDropdown">
                <li className="dropdown-item">🔔 New message received</li>
                <li className="dropdown-item">📦 Order shipped</li>
              </ul>
            </li>

            {/* Settings Dropdown */}
            <li className="nav-item dropdown mx-2">
              <button
                className="btn btn-light border-0 dropdown-toggle"
                id="settingsDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <CIcon icon={cilSettings} size="lg" />
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="settingsDropdown">
                <li className="dropdown-item">⚙️ Profile Settings</li>
                <li className="dropdown-item">🔒 Logout</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
