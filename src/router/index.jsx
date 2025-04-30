import { createHashRouter } from "react-router-dom"

//前台
import FrontLayout from "../layout/FrontLayout"
import HomePage from "../pages/front/HomePage"
import ProductPage from "../pages/front/ProductPage"
import ProductDetailPage from "../pages/front/ProductDetailPage"
import AboutUsPage from "../pages/front/AboutUsPage"
import CartPage from "../pages/front/CartPage"
import NotFound from "../pages/front/NotFound"
import LoginPage from "../pages/front/LoginPage"
import CheckoutSuccess from "../pages/front/CheckoutSuccess"
import BlogPage from "../pages/front/BlogPage"
import BlogDetailPage from "../pages/front/BlogDetailPage"
import CheckoutPayment from "../pages/front/CheckoutPayment"
import CheckoutForm from "../pages/front/CheckoutForm"

//後台
import AdminLayout from "../layout/AdminLayout"
import AdminHomePage from "../pages/admin/AdminHomePage"
import AdminProducts from "../pages/admin/AdminProducts"
import AdminBlogPage from "../pages/admin/AdminBlogPage"
import AdminCouponPage from "../pages/admin/AdminCouponPage"
import AdminOrderPage from "../pages/admin/AdminOrderPage"



const router = createHashRouter([
    {
        path:'/',
        element: <FrontLayout />,
        children:[
            {
                index: true,
                element: < HomePage />,
            },
            {
                path: 'product',
                element: < ProductPage />,
            },
            {
                path:'product/:id',
                element: <ProductDetailPage />
            },
            {
                path:'about',
                element: <AboutUsPage />
            },
            {
                path: 'cart',
                element: <CartPage />
            },
            { 
                path:'checkout-form',
                element: <CheckoutForm />
            },
            {
                path:'checkout-payment/:orderId',
                element:<CheckoutPayment />
            },
            {
                path: 'checkout-success/:orderId',
                element: <CheckoutSuccess />
            },
            {
                path:'login',
                element: <LoginPage />
            },
            {
                path:'blog',
                element: <BlogPage />
            },
            {
                path:'blog/:id',
                element: <BlogDetailPage />
            }
        ]
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                path: 'home',
                element: <AdminHomePage />
            },
            {
                path: 'products',
                element: <AdminProducts />
            },
            {
                path:'orders',
                element: <AdminOrderPage />
            },
            { //原本
                path: 'coupon',
                element: <AdminCouponPage />
            },
            {
                path:'blog-admin',
                element: <AdminBlogPage />
            },

        ]
    },
    {
        path:'*',
        element: <NotFound />
    }
])


export default router