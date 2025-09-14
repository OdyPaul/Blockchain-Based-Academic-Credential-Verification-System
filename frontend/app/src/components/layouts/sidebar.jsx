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
  cilHome,
  cilPuzzle,
  cilMagnifyingGlass,
  cilEnvelopeOpen,
  cilStorage,
  cilAddressBook
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
        <CSidebarBrand>VCS</CSidebarBrand>
      </CSidebarHeader>

      {/* Navigation */}
      <CSidebarNav>
        <CNavTitle>Navigation</CNavTitle>

        <CNavItem href="#">
          <CIcon customClassName="nav-icon" icon={cilHome} />
          Dashboard
        </CNavItem>

        <CNavItem href="#">
          <CIcon customClassName="nav-icon"  icon={cilEnvelopeOpen} />
          VC Request
          <CBadge color="primary ms-auto">NEW</CBadge>
        </CNavItem>

        <CNavGroup
          toggler={
            <>
              <CIcon customClassName="nav-icon" icon={cilPuzzle} />
              Accounts
            </>
          }
        >
          <CNavItem href="#">
            <span className="nav-icon">
              <span className="nav-icon-bullet">
              </span>
            </span>
            
             Users
          </CNavItem>
          <CNavItem href="#">
            <span className="nav-icon">
              <span className="nav-icon-bullet"></span>
            </span>
            Admins/Staff
          </CNavItem>
        </CNavGroup>

        <CNavItem href="#">
          <CIcon customClassName="nav-icon"  icon={cilStorage} />
          Key Vaults
        </CNavItem>
        <CNavItem href="#">
          <CIcon customClassName="nav-icon"  icon={cilAddressBook} />
         BlockChain Explorer
        </CNavItem>

        <CNavItem href="#">
          <CIcon customClassName="nav-icon" icon={cilMagnifyingGlass}/>
          About
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
