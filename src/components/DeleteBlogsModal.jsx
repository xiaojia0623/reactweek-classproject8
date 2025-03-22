import { useEffect, useRef } from 'react'
import axios from 'axios'
import { Modal } from 'bootstrap'
import { useDispatch } from 'react-redux'
import { pushMessage } from '../redux/toastSlice'

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const DeleteBlogsModal = ({tempBlogs,getBlogs, isOpen, setIsOpen}) => {
    const delBlogsModalRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        new Modal(delBlogsModalRef.current, {
        backdrop: false  //關閉點擊其他地方可將modal關閉
        });
    }, [])

    useEffect(() => {
        if (isOpen) {
            const modalInstance = Modal.getInstance(delBlogsModalRef.current);
            modalInstance.show();
        }
    },[isOpen])

    //串接 刪除文章api
    const deleteBlogs = async () => {
        try{
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/article/${tempBlogs.id}`)
            dispatch(pushMessage({
                title: "系統提示",
                text: "恭喜! 刪除文章成功",
                status: "success"
            }))
            
        }catch (error) {
            alert('刪除文章失敗');
            dispatch(pushMessage({
                title: "系統提示",
                text: "刪除文章失敗",
                status: "failed"
            }))
        }
    }

    //監聽觸發刪除按鈕並關閉刪除modal
    const handleDeleteBlogs = async () => {
        try{
            await deleteBlogs();

            getBlogs();

            handleCloseDelBlogsModal();
        }catch (error) {
            alert('刪除產品失敗')
        }
    }

    //關閉刪除modal
    const handleCloseDelBlogsModal = () => {
        const modalInstance = Modal.getInstance(delBlogsModalRef.current);
        modalInstance.hide();
        setIsOpen(false)
    }


  return (
    <div ref={delBlogsModalRef} className="modal fade" id="delProductModal" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5">刪除文章</h1>
                    <button
                        onClick={handleCloseDelBlogsModal}
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    你是否要刪除 
                    <span className="text-danger fw-bold">{tempBlogs.title}</span>
                </div>
                <div className="modal-footer">
                    <button
                        onClick={handleCloseDelBlogsModal}
                        type="button"
                        className="btn btn-secondary"
                    >
                        取消
                    </button>
                    <button onClick={handleDeleteBlogs} type="button" className="btn btn-danger">
                        刪除
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DeleteBlogsModal
