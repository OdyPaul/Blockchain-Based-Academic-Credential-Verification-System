"use client"

import React, { useEffect } from "react"
import CIcon from "@coreui/icons-react"
import { cilBell, cilSettings } from "@coreui/icons"

// Import Popover directly
import { Popover } from "bootstrap"

const Navbar = () => {
  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    popoverTriggerList.forEach((el) => {
      new Popover(el, {
        trigger: "focus",
        html: true,
      })
    })
  }, [])

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

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        {/* Right Side */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* Bell Icon */}
            <li className="nav-item mx-2">
              <button
                type="button"
                className="btn btn-light border-0"
                data-bs-toggle="popover"
                data-bs-placement="bottom"
                title="Notifications"
                data-bs-content="<ul class='list-unstyled mb-0'><li>🔔 New message received</li><li>📦 Order shipped</li></ul>"
              >
                <CIcon icon={cilBell} size="lg" />
              </button>
            </li>

            {/* Settings Icon */}
            <li className="nav-item mx-2">
              <button
                type="button"
                className="btn btn-light border-0"
                data-bs-toggle="popover"
                data-bs-placement="bottom"
                title="Settings"
                data-bs-content="<ul class='list-unstyled mb-0'><li>⚙️ Profile Settings</li><li>🔒 Logout</li></ul>"
              >
                <CIcon icon={cilSettings} size="lg" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
