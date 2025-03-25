import React, { useEffect } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';
import { Link } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import { updateCartData } from '../../redux/cartSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const routes = [
    { path: "/", name: "首頁" },
    { path: "/product", name: "商品" },
    { path: "/about", name: "關於我們" },
    { path: "/blog", name: "部落格" },
    { path: "/cart", name: "購物車" },
    { path: "/login", name: "後台登入" },
];

const Header = () => {

    const carts = useSelector((state) => state.cart.carts);

    const dispatch = useDispatch();

    useEffect(() => {
        const getCart = async() => {
            try{
                const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
                dispatch(updateCartData(res.data.data));
            }catch(error){
                const errorMessage = error.response?.data?.message || "請檢查輸入資料";
                dispatch(pushMessage({ title: "錯誤", text: `取得購物車失敗：${errorMessage}`, status: "failed" }));
            }
        }

        getCart();
    }, [dispatch])

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm position-sticky top-0 shadow z-3">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">
                陶瓷電商
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                <div className="navbar-nav align-items-center">
                    {routes.map((route) => (
                        <NavLink key={route.path} className="nav-item nav-link fw-bold header-hover me-4" to={route.path}>
                        {route.name === '購物車' ? (
                            <span className="nav-item nav-link me-4 position-relative">
                                <i className="fas fa-shopping-cart"></i>
                            <span className="position-absolute badge text-bg-success rounded-circle" style={{bottom: "20px", left: "20px"}}>
                                {carts?.length}
                            </span>
                            </span>
                        ) : route.name}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Header
