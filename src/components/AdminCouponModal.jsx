import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { pushMessage } from '../redux/toastSlice'
import { Modal } from 'bootstrap'

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};


const AdminCouponModal = ({modalCouponMode, tempCoupons, isOpen, setIsOpen, getCoupons, setIsCouponsModalOpen}) => {
    const couponModalRef = useRef(null); //使用useRef取得DOM數(預設值null，綁定在DOM)
    const fileInputRef = useRef(null); // 給 input type="file" 的 ref
    const [modalCouponData, setModalCouponData] = useState(tempCoupons) //tempProduct這邊作為初始值
    const dispatch = useDispatch();

    useEffect(() => { //當tempCoupons有變化時，modalCouponData也跟著變動
        setModalCouponData({
            ...tempCoupons
        })
    }, [tempCoupons])

    useEffect(() => {
        //畫面渲染後取得 DOM 建立modal
        new Modal(couponModalRef.current, {
        backdrop: false  //關閉點擊其他地方可將modal關閉
        });
    }, [])

    useEffect(()=> { //判斷是否要開啟
        if (isOpen) {
            const modalInstance = Modal.getInstance(couponModalRef.current);
            modalInstance.show(); 
        }
    },[isOpen])

     // 轉換 due_date 為字串格式
     const formatDueDate = (dueDate) => {
        if(!dueDate) {
            return "";
        }else if (isNaN(Number(dueDate))){
            return dueDate;
        }
        return new Date(dueDate * 1000).toISOString().split("T")[0];
    };


    //串接 新增優惠券api
    const createCoupon = async () => {
        setModalCouponData({
            title: "",
            due_date: "",
            code: generateRandomCode(),
            is_enabled: false,
            percent: 0,
        })
        try{
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/,"$1",);
            axios.defaults.headers.common.Authorization = token;
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/coupon`, {
                data: {
                ...tempCoupons,
                title: modalCouponData.title,
                due_date: Math.floor(new Date(modalCouponData.due_date).getTime() / 1000),
                percent: Number(modalCouponData.percent),
                code: generateRandomCode(),
                is_enabled: modalCouponData.is_enabled ? 1 : 0
                }
            })
            dispatch(pushMessage({
                title: "系統提示",
                text: "恭喜! 新增優惠券成功",
                status: "success"
            }))
            handleCloseCouponModal();
        }catch (error) {
            const errorMessage = error.response?.data?.message || "請檢查輸入資料";
            dispatch(pushMessage({
                title: "系統提示",
                text: `新增優惠券失敗：${errorMessage}`,
                status: "failed"
            }))
            setIsCouponsModalOpen(true);
        }
    }

    //model內的input監聽事件，呼叫此函式
    const handleModalInputChange = (e) => {
        const {value, name, checked, type} = e.target;
        setModalCouponData({
            ...modalCouponData,
            [name]: type === "checkbox" ? checked : value,
        })

    }

    //串接 編輯優惠券api
    const updateCoupon = async () => {

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/,"$1",);
        axios.defaults.headers.common.Authorization = token;
        try{
            await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/coupon/${tempCoupons.id}`, {
                data: {
                    ...modalCouponData,
                    due_date: Math.floor(new Date(modalCouponData.due_date).getTime() / 1000),  //formatDueDate(tempCoupons.due_date),
                    percent: Number(modalCouponData.percent),
                    code:modalCouponData.code,
                    is_enabled: modalCouponData.is_enabled ? 1 : 0
                }
            });
            dispatch(pushMessage({
                title: "系統提示",
                text: "恭喜! 編輯成功",
                status: "success"
            }))
            handleCloseCouponModal();
        }catch (error) {
            dispatch(pushMessage({
                title: "系統提示",
                text: "編輯優惠券失敗",
                status: "failed"
            }))
            console.log("問題: ", error.response.data.message);
        }
    }

    

    //關閉優惠券Modal
    const handleCloseCouponModal = () => {
        const modalInstance = Modal.getInstance(couponModalRef.current);
        modalInstance.hide(); //關閉modal
        setModalCouponData({title: "", percent: 0, due_date: "", is_enabled: 0, code: ""})
        
        // 清空 input file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setIsOpen(false)
    }

    //更新優惠券資料
    const handleUpdateCoupon = async () => {
        const apiCall = modalCouponMode === 'create' ? createCoupon() : updateCoupon();
        try{
            await apiCall();
            setIsCouponsModalOpen(false);
            getCoupons();

            dispatch(pushMessage({
                title: "系統提示",
                text: "更新優惠券券成功",
                status: "success"
            }))
        }catch (error) {
            const errorMessage = error.response?.data?.message || "請檢查輸入資料";
            dispatch(pushMessage({
                title: "系統提示",
                text: `更新優惠券失敗：${errorMessage}`,
                status: "failed"
            }))
        }
    }



  return (
    <div ref={couponModalRef} className="modal" id='productsModal'>
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{modalCouponMode === 'create' ? '新增優惠券' : '編輯優惠券'}</h5>
                    <button type="button" onClick={handleCloseCouponModal} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                

                <div className="modal-body">
                    <form >
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">標題</label>
                            <input value={modalCouponData.title}  name='title' onChange={handleModalInputChange} type="text" className="form-control" id="title" placeholder='請輸入標題' required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="due_date" className="form-label">到期日</label>
                            <input value={modalCouponData.due_date ? formatDueDate(modalCouponData.due_date): ""} name='due_date' onChange={handleModalInputChange} type="datetime-local" className="form-control" id="due_date" required/>
                        </div> 

                        <div className="mb-3">
                            <label htmlFor="percent" className="form-label">折扣%數</label>
                            <input value={modalCouponData.percent} name='percent' onChange={handleModalInputChange} type="number" min={0} className="form-control" id="percent" placeholder='請輸入折扣' required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="code" className="form-label">折扣序號</label>
                            <input value={modalCouponData.code} name="code" id="code" className="form-control" readOnly/>
                        </div>

                        <div className="form-check">
                            <input checked={modalCouponData.is_enabled} onChange={handleModalInputChange} name='is_enabled' type="checkbox" className="form-check-input" id="isEnabled" />
                            <label htmlFor="isEnabled" className="form-check-label">是否啟用</label>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button onClick={handleCloseCouponModal} type="button" className="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button onClick={handleUpdateCoupon} type="button" className="btn btn-primary">確認</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminCouponModal
