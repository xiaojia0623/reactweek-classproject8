import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { pushMessage } from '../../redux/toastSlice';
import Loading from "../../components/Loading";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const CheckoutPayment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [orderData, setOrderData] = useState({ products: {} });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);

  const cartItems = Object.values(orderData.products || {});
  const subTotal = cartItems.reduce((acc, item) => acc + item.total, 0);
  const finalTotal = cartItems.reduce((acc, item) => acc + item.final_total, 0);
  const discountAmount = subTotal - finalTotal;
  const shippingFee = subTotal >= 5000 ? 0 : 150;
  const calculatedFinalTotal = finalTotal + shippingFee;

  const getOrder = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/order/${orderId}`);
      setOrderData(res.data.order);
    } catch {
      dispatch(pushMessage({ text: '取得訂單失敗', status: 'failed' }));
    }
  }, [orderId, dispatch]);

  useEffect(() => {
    getOrder();
  }, [getOrder]);

  const payOrder = async () => {
    if (!orderId) {
      return;
    }

    try {
      setScreenLoading(true);
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/pay/${orderId}`);
      
      const finalOrder = {
        ...res.data.order,
        payment: res.data.order?.user?.payment || "信用卡",
        total: calculatedFinalTotal,
        paymentStatus: "已付款",
        create_at: Math.floor(Date.now() / 1000),
      };

      localStorage.setItem("specifiedOrder", JSON.stringify(finalOrder));
      dispatch(pushMessage({ title: "付款成功", text: "感謝您的訂購", status: "success" }));
      setShowSuccessModal(true);
    } catch {
      dispatch(pushMessage({ title: "付款失敗", text: "請稍後再試", status: "failed" }));
    } finally {
      setScreenLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate(`/checkout-success/${orderId}`);
  };

  return (
    <div className="container payment-page pt-5">
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
                <div className='custom-step-line ms-3 d-none d-md-block lineblack'></div>
              </li>
              <div className='vline d-md-none'></div>

              <li className='d-flex align-items-center'>
                <i className='fas fa-dot-circle d-md-inline d-block'></i>
                <span className='text-nowrap'>訂單完成</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <h2 className="mb-4 fw-bold">確認訂單</h2>
      <div className="row payment-orderInfo ">
        {/* 訂購人資訊 */}
        <div className="col-md-6 ">
          <h5>訂購人資訊</h5>
          {orderData && Object.keys(orderData).length > 0 ? (
            <div className='bg-light border rounded p-3  mb-lg-0'>
              <p>姓名：{orderData.user?.name}</p>
              <p>Email: {orderData.user?.email}</p>
              <p>電話：{orderData.user?.tel}</p>
              <p>地址：{orderData.user?.region}{orderData.user?.district}{orderData.user?.address}</p>
              <p>付款方式：{orderData.user?.payment}</p>
              {orderData.message && <p>留言：{orderData.message}</p>}
            </div>
          ) : (
            <p>資料正在加載中...</p>
          )}
        </div>

        {/* 訂單資訊 */}
        <div className="col-md-6">
          <div className="border rounded p-3 bg-light">
            <h5>訂單內容</h5>
            {cartItems.map((item, index) => (
              <div key={index} className="d-flex justify-content-between mb-2">
                <div>{item.product.title} x {item.qty}</div>
                <div>NT$ {item.total.toLocaleString()}</div>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between">
              <div>小計</div>
              <div>NT$ {subTotal.toLocaleString()}</div>
            </div>
            <div className="d-flex justify-content-between">
              <div>運費</div>
              <div>{shippingFee === 0 ? '免運費' : `NT$ ${shippingFee}`}</div>
            </div>
            <div className="d-flex justify-content-between">
              <div>折扣</div>
              <div>- {discountAmount.toLocaleString()} %</div>
            </div>
            <div className="d-flex justify-content-between fw-bold">
              <div>總金額</div>
              <div className="fw-bold fs-5">NT$ {calculatedFinalTotal.toLocaleString()}</div>
            </div>
            {orderId && (
              <p className="mt-3 text-muted">訂單編號: CRE{orderId}</p>
            )}
            <div className="text-center">
              <button
                type="button"
                className="btn btn-primary px-5"
                onClick={payOrder}
                disabled={screenLoading}
              >
                {screenLoading ? '處理中...' : '立即付款'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showSuccessModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>付款成功</Modal.Title>
        </Modal.Header>
        <Modal.Body>您的付款已成功，將跳轉至結帳成功頁面。</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleModalClose}>
            確定
          </button>
        </Modal.Footer>
      </Modal>

      {screenLoading && <Loading />}
    </div>
  );
};

export default CheckoutPayment;

