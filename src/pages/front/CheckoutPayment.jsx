import React,{ useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const CheckoutPayment = () => {
    const [cartItem, setCartItem] = useState([]);
    const [orderData, setOrderData] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id: orderId } = useParams();

    useEffect(() => {
        //取得購物車清單
        const getCartList = async() => {
            try {
              const token = getToken();
              axios.defaults.headers.common.Authorization = token;
              const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
              setCartItem(res.data.data);
              
            }catch(error){
              const errorMessage = error.response?.data?.message || "請檢查輸入資料";
              dispatch(pushMessage({ title: "錯誤", text: `取得購物車失敗：${errorMessage}`, status: "failed" }));
            }
        }
        getCartList();
        getOrderInfo();
      }, [dispatch]);

      useEffect(() => {
        const getOrder = async () => {
          try{
            const token = getToken();
            axios.defaults.headers.common['Authorization'] = token;

            const {data: {order},} = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/order/${orderId}`);
            setCartItem(order);
          }catch(error){
            const errorMessage = error.response?.data?.message || "請檢查輸入資料";
              dispatch(pushMessage({ title: "錯誤", text: `取得訂單失敗：${errorMessage}`, status: "failed" }));
          }
        }
        getOrder(orderId);
      },[orderId, dispatch])
    


      const getToken = () => {
        return document.cookie.replace(/(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/, '$1');
      };


      const checkout = async () => {
        try {
            const token = getToken();
            axios.defaults.headers.common['Authorization'] = token;
            const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/pay/${orderId}`);
            console.log(res.data.message)

            
          if (res.data.success) {
            dispatch(pushMessage({ title: "成功", text: "結帳成功", status: "success" }));
            navigate(`/checkout-success`);
          }
        }catch(error){
          const errorMessage = error.response?.data?.message || "請檢查輸入資料";
            dispatch(pushMessage({ title: "錯誤", text: `結帳失敗：${errorMessage}`, status: "failed" }));
        }
      }

      // 取得填寫的表單資訊
      const getOrderInfo = () => {
        const storedData = sessionStorage.getItem("orderFormData");
        if (storedData) {
          setOrderData(JSON.parse(storedData));
        }
      };

      

  return (
      <>
      <div className="container my-5">
        <h4 className="fs-2 fw-bold">訂單確認</h4>

        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title fw-bold">結帳明細</h4>
                {orderData ? (
                  <>
                    <p className="card-text">訂購人姓名: {orderData.name}</p>
                    <p className="card-text">訂購人手機: {orderData.phone}</p>
                    <p className="card-text">訂購人Email: {orderData.email}</p>
                    <p className="card-text">支付方式: {orderData.paymentMethod}</p>
                    <p className="card-text">
                      送貨地址: {orderData.region} {orderData.district} {orderData.address}
                    </p>
                    <button onClick={() => checkout(orderData.orderId)} 
                      className="btn btn-primary">結帳</button>
                  </>
                ) : (
                  <p>載入中...</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <h4 className="fs-2 fw-bold">訂單明細</h4>
            <div className="card">
              {cartItem?.carts?.map((item) => (
                <ul className="card-body list-group" key={item.id}>
                  <li className="list-group-item d-flex justify-content-between border-0">
                    <div className="d-flex gap-2">
                      <img src={item.product.imageUrl} alt={item.product.title} className="rounded-2" style={{ width: "100px", height: "100px" }} />
                      <p className="fs-4 fw-bold">{item.product.title}</p>
                      <p className="fs-5">{item.qty}{item.product.unit}</p>
                    </div>
                    <hr />
                    <div>
                      <p>金額: NT$ {item.final_total} 元</p>
                    </div>
                  </li>
                </ul>
              ))}
              <div className="pt-2 ps-2">
                <p className="fs-4 fw-bold">總金額: NT$ {cartItem?.final_total} 元</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    )
}

export default CheckoutPayment
