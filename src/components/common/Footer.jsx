import React from 'react'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <div className="bg-color py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between text-white mb-md-7 mb-4">
            <NavLink  className="footer-logo h4 text-decoration-none fw-bold" to="/" style={{color:'#4d4f4f'}}>
              名奇陶瓷創意
            </NavLink >
            <ul className="d-flex list-unstyled mb-0 h4">
              <li className=''>
                <Link href="#" className="text-white mx-3 home-icon-hover p-2 rounded">
                  <i className="fab fa-facebook"></i>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white mx-3 home-icon-hover p-2 rounded">
                  <i className="fab fa-instagram"></i>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white ms-3 home-icon-hover p-2 rounded">
                  <i className="fab fa-line"></i>
                </Link>
              </li>
            </ul>
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end align-items-start text-white">
            <div className="mb-md-0 mb-1">
              <p className='me-2' style={{color:'#4d4f4f'}}>電話: <a href="tel:02-3456-7890">02-3456-7890</a></p>
              <p className='me-2' style={{color:'#4d4f4f'}}>信箱: <a href="mailto:service@mail.com"  className="mb-0">service@mail.com</a></p>
              
            </div>
            <p className="mb-0">©2025 All Rights Reserved By Michelle(僅供練習用請勿商用).</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
