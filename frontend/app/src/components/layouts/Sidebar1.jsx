import React, { useState } from "react";
import { FaHome, FaChevronLeft, FaChartBar, FaUsers, FaBox, FaCog } from "react-icons/fa";
import Navbar from './navbar'

const Sidebar1 = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="d-flex ">
      <nav className={`sidebar d-flex flex-column flex-shrink-0 position-fixed ${collapsed ? "collapsed" : ""}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaChevronLeft />
        </button>

        <div className="p-4">
          <h4 className="logo-text fw-bold mb-0">NexusFlow</h4>
          <p className="text-muted small hide-on-collapse">Dashboard</p>
        </div>

        <div className="nav flex-column">
          <a href="#" className="sidebar-link text-decoration-none p-3">
            <FaHome className="me-3" />
            <span className="hide-on-collapse">Dashboard</span>
          </a>
          <a href="#" className="sidebar-link text-decoration-none p-3">
            <FaChartBar className="me-3" />
            <span className="hide-on-collapse">Analytics</span>
          </a>
          <a href="#" className="sidebar-link text-decoration-none p-3">
            <FaUsers className="me-3" />
            <span className="hide-on-collapse">Customers</span>
          </a>
          <a href="#" className="sidebar-link text-decoration-none p-3">
            <FaBox className="me-3" />
            <span className="hide-on-collapse">Products</span>
          </a>
          <a href="#" className="sidebar-link text-decoration-none p-3">
            <FaCog className="me-3" />
            <span className="hide-on-collapse">Settings</span>
          </a>
        </div>

        <div className="profile-section mt-auto p-4">
          <div className="d-flex align-items-center">
            <img
              src="#"
              style={{ height: "60px" }}
              className="rounded-circle"
              alt="Profile"
            />
            <div className="ms-3 profile-info">
              <h6 className="text-white mb-0">Alex Morgan</h6>
              <small className="text-muted">Admin</small>
            </div>
          </div>
        </div>
      </nav>


    </div>
  );
};

export default Sidebar1;
