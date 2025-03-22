import { useEffect, useRef } from 'react'
import axios from 'axios'
import { Modal } from 'bootstrap'
import { useDispatch } from 'react-redux'
import { pushMessage } from '../redux/toastSlice'

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const TestAdminDeleteOrderModal = ({tempOrders,getOrders, isOrdersOpen, setIsOrdersOpen , pageData, deleteOrderModalState}) => {
    const delProductModalRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        new Modal(delProductModalRef.current, {
        backdrop: false  //關閉點擊其他地方可將modal關閉
        });
    }, [])

    useEffect(() => {
        if (isOrdersOpen) {
            const modalInstance = Modal.getInstance(delProductModalRef.current);
            modalInstance.show();
        }
    },[isOrdersOpen])

    //串接 刪除單一訂單api
    const deleteOrders = async () => {
        try{
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/order/${tempOrders.id}`)
            getOrders(pageData.current_page);
            handleCloseDelOrderModal();
            dispatch(pushMessage({
                title: "系統提示",
                text: "訂單已刪除",
                status: "success"
            }))
        }catch (error) {
            dispatch(pushMessage({
                title: "系統提示",
                text: "刪除訂單失敗",
                status: "failed"
            }))
        }
    }

    //串接 刪除全部訂單
    const deleteAllOrders = async () => {
        try{
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/orders/all`);
            handleCloseDelOrderModal();
            getOrders(pageData.current_page);

            dispatch(pushMessage({
                title: "系統提示",
                text: "所有訂單已刪除",
                status: "success"
            }))
        }catch(error) {
            dispatch(pushMessage({
                title: "系統提示",
                text: "所有訂單已刪除失敗",
                status: "failed"
            }))
        }
    }

    //監聽觸發刪除按鈕並關閉刪除modal
    const handleDeleteOrders = async () => {
        const apiCall = deleteOrderModalState === "deleteSingleOrder" ? deleteOrders : deleteAllOrders;
        try{
            await apiCall();
            getOrders(pageData.current_page);
        }catch (error) {
            alert('刪除產品失敗')
            dispatch(pushMessage({
                title: "系統提示",
                text: "刪除訂單失敗",
                status: "failed"
            }))
        }
    }

    //關閉刪除modal
    const handleCloseDelOrderModal = () => {
        const modalInstance = Modal.getInstance(delProductModalRef.current);
        modalInstance.hide();
        setIsOrdersOpen(false)
    }

  return (
    <div ref={delProductModalRef} className="modal fade" id="delProductModal" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5">刪除產品</h1>
                    <button
                        onClick={handleCloseDelOrderModal}
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    你是否要刪除 
                    <span className="text-danger fw-bold">{tempOrders.title}</span>
                </div>
                <div className="modal-footer">
                    <button
                        onClick={handleCloseDelOrderModal}
                        type="button"
                        className="btn btn-secondary"
                    >
                        取消
                    </button>
                    <button onClick={handleDeleteOrders} type="button" className="btn btn-danger">
                        刪除
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TestAdminDeleteOrderModal
