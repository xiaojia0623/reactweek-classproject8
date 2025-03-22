import React from 'react'
import axios from 'axios';
import { NavLink, Outlet } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const AdminLayout = () => {
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
          await axios.post(`${BASE_URL}/logout`);
          navigate("/login");
        } catch (error) {
          alert(error.response.data.message);
        }
    };

  return (
    <div className='fixed-top'>
        <nav className="navbar bg-primary border-bottom border-body" data-bs-theme="dark">
            <div className="container">
                <ul className="navbar-nav flex-row gap-5 fs-5 align-items-center">
                    <li className="nav-item">
                        <NavLink className="nav-link" aria-current="page" to="/admin/home">
                            後臺管理首頁
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" aria-current="page" to="/admin/products">
                            產品管理頁面
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" aria-current="page" to="/admin/orders">
                            訂單管理頁面
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" aria-current="page" to="/admin/coupon">
                            優惠券管理
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" aria-current="page" to="/admin/blog-admin">
                            部落格貼文管理
                        </NavLink>
                    </li>
                    <li>
                        <button onClick={handleLogout} type='button' className='btn btn-secondary'>登出</button>
                    </li>
                </ul>
            </div>
        </nav>
        <Outlet />
    </div>
  )
}

export default AdminLayout
