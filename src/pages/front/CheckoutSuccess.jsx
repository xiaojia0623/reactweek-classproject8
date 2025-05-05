import axios from "axios";
import { useDispatch } from "react-redux";
import { updateCartData } from "../../redux/cartSlice";
import { pushMessage } from "../../redux/toastSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [paymentStatus, setPaymentStatus] = useState('尚未付款');
  const { orderId } = useParams();

  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/order/${orderId}`);
        setData(res.data.order);
      } catch {
        dispatch(pushMessage({ title: "取得訂單失敗", text: "請稍後再試", status: "failed" }));
      }
    };
    getOrder();
  }, [orderId, dispatch]);

  // 取得付款狀態及訂單資料
  useEffect(() => {
    const specifiedOrder = localStorage.getItem("specifiedOrder");
    if (specifiedOrder) {
      try {
        const parsedSpecData = JSON.parse(specifiedOrder);
        setData(parsedSpecData);

        // 根據前一頁的資料設置付款狀態
        setPaymentStatus(parsedSpecData.paymentStatus || '尚未付款');
      } catch {
        dispatch(pushMessage({text: "解析訂單資料失敗", status: "failed" }));
        setData({});
        setPaymentStatus('尚未付款');
      }
    } else {
      dispatch(pushMessage({ text: "未找到指定的訂單資料！", status: "failed" }));
      setData({});
      setPaymentStatus('尚未付款');
    }
  }, [dispatch]);

  // 小計、折扣與運費計算
  const cartItems = Object.values(data.products || {});
  const subTotal = cartItems.reduce((acc, item) => acc + item.total, 0);
  const finalTotal = cartItems.reduce((acc, item) => acc + item.final_total, 0);
  const shippingFee = subTotal >= 5000 ? 0 : 150;
  const totalAmount = finalTotal + shippingFee;

  // 取得購物車資料
  useEffect(() => {
    const getCartList = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/${API_PATH}/cart`);
        dispatch(updateCartData(res.data.data));
      } catch (error) {
        const errorMessage = error.response?.data?.message || "請檢查輸入資料";
        dispatch(pushMessage({ title: "錯誤", text: `取得失敗：${errorMessage}`, status: "failed" }));
      }
    };

    getCartList();
  }, [dispatch]);

  // 時間格式化
  const formatTime = (timeStamp) => {
    const time = new Date(timeStamp * 1000);
    return `${time.getFullYear()}/${
      time.getMonth() + 1
    }/${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  };

  return (
    <>
    <div className="container text-center success-page">
      <div className='row justify-content-center mt-3 mt-md-4'>
        <div className='col-auto col-md-10'>
          <nav className='navbar'>
            <ul className='d-flex flex-md-row flex-column justify-content-center  list-unstyled mx-auto '>
              <li className='position-relative d-flex align-items-center  me-md-3 '>
                <i className='fas fa-check-circle d-md-inline d-block text-danger'></i>
                <span className='text-nowrap'>填寫表單</span>
                <div className='custom-step-line ms-3 d-none d-md-block'></div>
              </li>
              <div className='vline d-md-none'></div>

              <li className='position-relative d-flex align-items-center me-md-3'>
                <i className='fas fa-check-circle d-md-inline d-block text-danger'></i>
                <span className='text-nowrap'>訂單確認</span>
                <div className='custom-step-line ms-3 d-none d-md-block'></div>
              </li>
              <div className='vline d-md-none'></div>

              <li className='d-flex align-items-center'>
                <i className='fas fa-check-circle d-md-inline d-block text-danger'></i>
                <span className='text-nowrap'>訂單完成</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <h2 className="mb-4">訂單完成</h2>
      <div className="card mx-auto p-4" style={{ maxWidth: '500px' }}>
        <h4 className="mb-3 text-success">感謝您的訂購！</h4>
        <p><strong>訂單編號：</strong> CRE{data.id || '資料不存在'}</p>
        <p><strong>支付方式：</strong>{data.user?.payment}</p>
        <p><strong>付款狀態：</strong>{paymentStatus}</p>
        <p><strong>訂單總金額：</strong>
        NT$ {totalAmount.toLocaleString()}元
        </p>
        <p><strong>建立時間：</strong>{formatTime(data.create_at)}</p>
        <div className="mt-4">
          <button className="btn btn-outline-primary" onClick={() => navigate('/')}>
            回到首頁
          </button>
        </div>
      </div>
    </div>
    </>
  );
  
};

export default CheckoutSuccess;
