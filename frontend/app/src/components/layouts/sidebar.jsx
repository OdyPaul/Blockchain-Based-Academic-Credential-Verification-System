// src/components/layouts/Sidebar.jsx
import React, { useState } from 'react'
import {
  CBadge,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
  CNavGroup,
  CNavItem,
  CNavTitle,
  CSidebarFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCloudDownload,
  cilLayers,
  cilPuzzle,
  cilSpeedometer
} from '@coreui/icons'

const Sidebar = () => {
  const [unfoldable, setUnfoldable] = useState(false)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      unfoldable={unfoldable}
    >
      {/* Sidebar Header */}
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>CoreUI</CSidebarBrand>
      </CSidebarHeader>

      {/* Navigation */}
      <CSidebarNav>
        <CNavTitle>Navigation</CNavTitle>

        <CNavItem href="#">
          <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
          Dashboard
        </CNavItem>

        <CNavItem href="#">
          <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
          With badge
          <CBadge color="primary ms-auto">NEW</CBadge>
        </CNavItem>

        <CNavGroup
          toggler={
            <>
              <CIcon customClassName="nav-icon" icon={cilPuzzle} />
              Dropdown
            </>
          }
        >
          <CNavItem href="#">
            <span className="nav-icon">
              <span className="nav-icon-bullet"></span>
            </span>
            Dropdown Item 1
          </CNavItem>
          <CNavItem href="#">
            <span className="nav-icon">
              <span className="nav-icon-bullet"></span>
            </span>
            Dropdown Item 2
          </CNavItem>
        </CNavGroup>

        <CNavItem href="#">
          <CIcon customClassName="nav-icon" icon={cilCloudDownload} />
          Download CoreUI
        </CNavItem>

        <CNavItem href="#">
          <CIcon customClassName="nav-icon" icon={cilLayers} />
          Try CoreUI PRO
        </CNavItem>
      </CSidebarNav>

      {/* Footer with Toggler */}
      <CSidebarFooter className="border-top">
        <CSidebarToggler
          onClick={() => setUnfoldable(!unfoldable)}
          style={{ cursor: 'pointer' }}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default Sidebar
