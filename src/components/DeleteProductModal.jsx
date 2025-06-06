import { useEffect, useRef } from 'react'
import axios from 'axios'
import { Modal } from 'bootstrap'
import { useDispatch } from 'react-redux';
import { pushMessage } from '../redux/toastSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const DeleteProductModal = ({tempProduct,getProducts, isOpen, setIsOpen}) => {
    const delProductModalRef = useRef(null);
    const dispatch = useDispatch();
    useEffect(() => {
        new Modal(delProductModalRef.current, {
        backdrop: false
        });
    }, [])

    useEffect(() => {
        if (isOpen) {
            const modalInstance = Modal.getInstance(delProductModalRef.current);
            modalInstance.show();
        }
    },[isOpen])

    //串接 刪除產品api
    const deleteProduct = async () => {
        try{
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`)
        }catch (error) {
            const errorMessage = error.response?.data?.message || "請檢查輸入資料";
            alert('刪除產品失敗');
            dispatch(pushMessage({ title: "錯誤", text: `刪除產品失敗：${errorMessage}`, status: "failed" }));
        }
    }

    //監聽觸發刪除按鈕並關閉刪除modal
    const handleDeleteProduct = async () => {
        try{
            await deleteProduct();
            getProducts();
            handleCloseDelProductModal();
        }catch (error) {
            const errorMessage = error.response?.data?.message || "請檢查輸入資料";
            dispatch(pushMessage({ title: "錯誤", text: `刪除產品失敗：${errorMessage}`, status: "failed" }));
        }
    }

    //關閉刪除modal
    const handleCloseDelProductModal = () => {
        const modalInstance = Modal.getInstance(delProductModalRef.current);
        modalInstance.hide();
        setIsOpen(false)
    }


  return (
    <div ref={delProductModalRef} className="modal fade" id="delProductModal" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5">刪除產品</h1>
                    <button
                        onClick={handleCloseDelProductModal}
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    你是否要刪除 
                    <span className="text-danger fw-bold">{tempProduct.title}</span>
                </div>
                <div className="modal-footer">
                    <button
                        onClick={handleCloseDelProductModal}
                        type="button"
                        className="btn btn-secondary"
                    >
                        取消
                    </button>
                    <button onClick={handleDeleteProduct} type="button" className="btn btn-danger">
                        刪除
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DeleteProductModal
