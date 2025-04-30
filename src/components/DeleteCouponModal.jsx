import { useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';

import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function DeleteCouponModal({isOpen, setIsOpen, getCoupons, tempCoupon}) {

  const dispatch = useDispatch();

  const dalCouponModal = useRef(null);

  useEffect(() => {
    new Modal(dalCouponModal.current,{
      backdrop: false
    });
  },[])

  const deleteCoupon = async() => {
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/coupon/${tempCoupon.id}`)
      
      dispatch(pushMessage({text: '刪除產品成功', status: 'success'}))
    } catch {
      dispatch(pushMessage({text: '刪除產品失敗', status: 'danger'}))
    }
  }

  const handleDeleteCoupon = async() => {
    try {
      await deleteCoupon();
      getCoupons();
      handleCloseDelModal();
    } catch {
      dispatch(pushMessage({text: '刪除產品失敗', status: 'danger'}))
    }
  }

  useEffect(() => {
    if(isOpen) {
      const modaInstance = Modal.getInstance(dalCouponModal.current);
      modaInstance.show();
    }
  },[isOpen])

  const handleCloseDelModal = () => {
    const modaInstance = Modal.getInstance(dalCouponModal.current);
    modaInstance.hide();
    setIsOpen(false)
  }


  return (
    <div
    ref={dalCouponModal}
    className="modal fade"
    id="dalCouponModal"
    tabIndex="-1"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5">刪除優惠卷</h1>
          <button
            onClick={handleCloseDelModal}
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          你是否要刪除 
          <span className="text-danger fw-bold ms-1">{tempCoupon.title}</span>
        </div>
        <div className="modal-footer">
          <button
            onClick={handleCloseDelModal}
            type="button"
            className="btn btn-secondary"
          >
            取消
          </button>
          <button onClick={handleDeleteCoupon} type="button" className="btn btn-danger">
            刪除
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default DeleteCouponModal;