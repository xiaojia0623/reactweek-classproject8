import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import dayjs from 'dayjs';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// 產生隨機 10 碼序號 (交錯大寫英文與數字)
const generateRandomCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return code;
};

function AdminCouponModal({
  modalMode,
  tempCoupon,
  isOpen,
  setIsOpen,
  getCoupons,
}) {
  const [modalData, setModalData] = useState({
    title: '',
    percent: 0,
    due_date: '',
    is_enabled: 1,
    code: '',
  });

  useEffect(() => {
    if (modalMode === "edit") {
      setModalData({
        ...tempCoupon,
        due_date: dayjs.unix(tempCoupon.due_date).format('YYYY-MM-DD'),
      });
    } else {
      setModalData({
        title: '',
        percent: 0,
        due_date: '',
        is_enabled: 1,
        code: generateRandomCode(),
      });
    }
  }, [tempCoupon, modalMode]);

  const couponModalRef = useRef(null);

  useEffect(() => {
    new Modal(couponModalRef.current, {
      backdrop: false,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(couponModalRef.current);
      modalInstance.show();
    }
  }, [isOpen]);

  const handleCloseCouponModal = () => {
    const modalInstance = Modal.getInstance(couponModalRef.current);
    modalInstance.hide();
    setIsOpen(false);
  };

  const handleModalInputChange = (e) => {
    const { value, name, checked, type } = e.target;
    
    setModalData({
      ...modalData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const createCoupon = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/coupon`, {
        data: {
          ...modalData,
          percent: Number(modalData.percent),
          due_date: (new Date(modalData.due_date).getTime())/1000,
          is_enabled: modalData.is_enabled ? 1 : 0,
        },
      });
      handleCloseCouponModal();
      Swal.fire({
        title: "新增優惠券成功!",
        icon: "success",
        draggable: true
      });
    } catch (error) {
      if (error.status === 400){
        Swal.fire({
          title: "新增優惠券失敗",
          text: error.response.data.message.join("、"),
          icon: "error",
          confirmButtonText: "確定"
        });
      } else {
        Swal.fire({
          title: "新增優惠券失敗",
          text: "請重新操作一次",
          icon: "error",
          confirmButtonText: "確定"
        });
      }
    }
  };

  const updateCoupon = async () => {
    try {
      await axios.put(
        `${BASE_URL}/v2/api/${API_PATH}/admin/coupon/${modalData.id}`,
        {
          data: {
            ...modalData,
            percent: Number(modalData.percent),
            due_date: (new Date(modalData.due_date).getTime())/1000,
            is_enabled: modalData.is_enabled ? 1 : 0,
          },
        }
      );
      handleCloseCouponModal();
      Swal.fire({
        title: "更新優惠券成功!",
        icon: "success",
        draggable: true
      });
    } catch (error) {
      if (error.status === 400){
        Swal.fire({
          title: "編輯優惠券失敗",
          text: error.response.data.message.join("、"),
          icon: "error",
          confirmButtonText: "確定"
        });
      } else {
        Swal.fire({
          title: "編輯優惠券失敗",
          text: "請重新操作一次",
          icon: "error",
          confirmButtonText: "確定"
        });
      }
    }
  };

  const handleUpdateCoupon = async () => {
    const apiCall = modalMode === "create" ? createCoupon : updateCoupon;
    try {
      await apiCall();
      getCoupons();
    } catch {
      Swal.fire({
        title: "更新優惠券失敗",
        icon: "error",
        confirmButtonText: "確定"
      });
    }
  };

  return (
    <div
      ref={couponModalRef}
      id="couponModal"
      className="modal"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fs-4">
              {modalMode === "create" ? "新增優惠券" : "編輯優惠券"}
            </h5>
            <button
              type="button"
              onClick={handleCloseCouponModal}
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    優惠券名稱
                  </label>
                  <input
                    value={modalData.title}
                    onChange={handleModalInputChange}
                    name="title"
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入名稱"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="percent" className="form-label">
                    折扣百分比 e.g. 打 9 折請輸入 90
                  </label>
                  <input
                    value={modalData.percent}
                    onChange={handleModalInputChange}
                    name="percent"
                    id="percent"
                    type="text"
                    className="form-control"
                    placeholder="請輸入折扣百分比"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="code" className="form-label">
                    折扣碼
                  </label>
                  <input
                    value={modalData.code}
                    onChange={handleModalInputChange}
                    name="code"
                    id="code"
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="due_date" className="form-label">
                    到期日
                  </label>
                  <input
                    value={modalData.due_date}
                    onChange={handleModalInputChange}
                    name="due_date"
                    id="due_date"
                    type="date"
                    className="form-control"
                    placeholder="請選擇到期日"
                  />
                  
                </div>
                <div className="form-check">
                  <input
                    checked={modalData.is_enabled}
                    onChange={handleModalInputChange}
                    name="is_enabled"
                    type="checkbox"
                    className="form-check-input"
                    id="isEnabled"
                  />
                  <label className="form-check-label" htmlFor="isEnabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top bg-light">
            <button
              type="button"
              onClick={handleCloseCouponModal}
              className="btn btn-secondary"
            >
              取消
            </button>
            <button
              onClick={handleUpdateCoupon}
              type="button"
              className="btn btn-primary"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCouponModal;

AdminCouponModal.propTypes = {
  modalMode: PropTypes.oneOf(["create", "edit"]),
  tempCoupon: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  getCoupons: PropTypes.func.isRequired
};