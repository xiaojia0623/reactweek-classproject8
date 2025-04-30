import { useEffect, useState, useRef, useCallback } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { pushMessage } from '../redux/toastSlice'
import { Modal } from 'bootstrap'
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const AdminOrderModal = ({tempOrders, isOrdersOpen, setIsOrdersOpen, setOrders}) => {
    const ordersModalRef = useRef(null);
    const [modalOrdersData, setModalOrdersData] = useState(tempOrders)
    const dispatch = useDispatch();
    const [qtySelect] = useState(1);
    
    useEffect(() => {
        setModalOrdersData({
            ...tempOrders
        })
    }, [tempOrders])


    useEffect(()=> {
        if (isOrdersOpen) {
            const modalInstance = Modal.getInstance(ordersModalRef.current);
            modalInstance.show(); 
        }
    },[isOrdersOpen])

    const getToken = () => {
        return document.cookie.replace(/(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/, '$1');
    };

    //取得後台訂單資料
    const getOrders = useCallback(async (page=1) => {
        try{ //串接產品api
            const token = getToken();
            axios.defaults.headers.common['Authorization'] = token;
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/orders?page=${page}`);
                setOrders(res.data.orders);
        }catch(error) {
            Swal.fire({
                title: "訂單取得失敗!",
                text: error.response.data.message.join("、"),
                icon: "error",
                confirmButtonText: "確定"
            });
        }
    }, [setOrders]);

    useEffect(() => {
        getOrders();
    }, [getOrders])

    useEffect(() => {
        //畫面渲染後取得 DOM 建立modal
        new Modal(ordersModalRef.current, {
        backdrop: false
        });
    }, [getOrders])


    //調整訂單產品個數
    const editProductQty = (itemPrice, product_id, qty) => {
        const newProductQty = {
            ...modalOrdersData.products,
        }

        newProductQty[product_id].qty = qty;
        newProductQty[product_id].final_total = qty * itemPrice;
        newProductQty[product_id].total = qty * itemPrice;

        setModalOrdersData({
            ...modalOrdersData,
            products: newProductQty,
        })
    }

    //model內的input監聽事件，呼叫此函式
    const handleModalInputChange = (e) => {
        const { value, name } = e.target;
        const newGuest = {...modalOrdersData.user};
        newGuest[name] = value;
        setModalOrdersData({
            ...modalOrdersData,
            user: newGuest
        })
    }

    //model內的input監聽事件，呼叫此函式
    const handleModalIsPaidChange = (e) => {
        const {value, name, checked, type} = e.target;
        setModalOrdersData({
            ...modalOrdersData,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    //訂單留言
    const handalModalMessageChange = (e) => {
        const {value} = e.target;
        setModalOrdersData({...modalOrdersData, message: value})
    }
    
    //串接 編輯訂單api
    const editOrders = async() => {
        const {message} = modalOrdersData;
        const allOrders = {
            ...modalOrdersData
        }

        let totalAmount = 0;
        if (allOrders.products) {
            const arr = Object.values(allOrders.products);
            arr.forEach((items) => {
                totalAmount += items.final_total;
            })
        }

        const ordersData = {
            data: {
                ...modalOrdersData,
                message: message || "",
                total: totalAmount,
                create_at : Math.floor(new Date(modalOrdersData.create_at).getTime() / 1000), 
                is_paid: modalOrdersData.is_paid === true || modalOrdersData.is_paid === "true" ? true : false
            }
        }

        try{
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common.Authorization = token;
            await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/order/${modalOrdersData.id}`, ordersData);
            dispatch(
                pushMessage({
                    title: "系統提示",
                    text: "訂單編輯成功",
                    status: "success",
                })
            );
            handleCloseOrdersModal();

        }catch(error) {
            const errorMessage = error.response?.data?.message || "請檢查輸入資料";
            dispatch(
                pushMessage({
                    title: "系統提示",
                    text: `訂單編輯失敗：${errorMessage}`,
                    status: "failed",
                })
            );
        }
    }

    //刪除單一訂單
    const deleteOrderItem = (orderId) => {
        const allOrders = {
            ...modalOrdersData,
        };
        const {[orderId]: _, ...newProducts} = allOrders.products;
        setModalOrdersData({...modalOrdersData, products: newProducts})
    }

    //關閉訂單Modal
    const handleCloseOrdersModal = () => {
        //ordersModalRef.current.hide();
        setIsOrdersOpen(false);
    }
    


  return (
    <div ref={ordersModalRef} className="modal" id='productsModal'>
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">編輯訂單 #{tempOrders.num} 詳細資料</h5>
                    <button type="button" onClick={handleCloseOrdersModal} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                

                <div className="modal-body">
                    <div className="row">
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">客人姓名</label>
                                <input value={modalOrdersData.user.name || ""}  name='name' onChange={handleModalInputChange} type="text" className="form-control" id="name" placeholder='客人姓名'/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input value={modalOrdersData.user.email || ""} name='email' onChange={handleModalInputChange} type="text" className="form-control" id="email" placeholder='Email'/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="tel" className="form-label">手機</label>
                                <input value={modalOrdersData.user.tel || ""} name='tel' onChange={handleModalInputChange} className="form-control" id="tel"  placeholder='手機'/>
                            </div>

                            
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">客人地址</label>
                                <input value={modalOrdersData.user.address || ""} onChange={handleModalInputChange} name="address" id="address" className="form-control" placeholder='地址' />
                            </div>

                            <div className="mb-3 d-flex flex-column">
                                <label htmlFor="message" className="form-label">客人留言</label>
                                <textarea value={modalOrdersData.message || ""} row={10} cols={30}  name="message" onChange={handalModalMessageChange} id="message" className='form-control' placeholder='客人留言'></textarea>
                            </div>
                            {modalOrdersData.products? (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">產品名稱</th>
                                            <th scope="col">數量</th>
                                            <th scope="col">價錢</th>
                                            <th scope="col">刪除</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values(modalOrdersData.products).map((items) => (
                                            <tr key={items.id}>
                                                <th scope="row">
                                                    <p>{items.product.title}</p>
                                                </th>
                                                <td>
                                                    <div className="input-group my-3 bg-light rounded">
                                                        <div className="input-group-prepend">
                                                            <button
                                                                onClick={() => editProductQty(
                                                                    items.product.price,
                                                                    items.id,
                                                                    items.qty - 1
                                                                )}
                                                                className="btn btn-outline-dark border-0 py-2"
                                                                type="button"
                                                                disabled={ qtySelect === 1}
                                                                id="button-addon1"
                                                            >
                                                            <i className="fas fa-minus"></i>
                                                            </button>
                                                        </div>
                                                        <span className='btn border-0 text-center my-auto shadow-none'>{items.qty}</span>
                                                        <div className="input-group-append">
                                                            <button
                                                                onClick={() => editProductQty(
                                                                    items.product.price,
                                                                    items.id,
                                                                    items.qty + 1
                                                                )}
                                                                className="btn btn-outline-dark border-0 py-2"
                                                                type="button"
                                                                id="button-addon2"
                                                            >
                                                            <i className="fas fa-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p>{items.total.toLocaleString()}</p>
                                                </td>
                                                <td>
                                                    <button className='btn btn-outline-danger' onClick={() => deleteOrderItem(items.id)}>刪除</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (<p>目前尚未有任何產品</p>)}

                            <div className="form-check">
                                <input className="form-check-input" onChange={handleModalIsPaidChange} name='is_Paid' checked={modalOrdersData.is_paid} type="checkbox" value="" id="is_Paid" />
                                <label htmlFor='is_Paid' className="form-check-label">已付款</label>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="modal-footer">
                    <button onClick={handleCloseOrdersModal} type="button" className="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button onClick={editOrders} type="button" className="btn btn-primary">確認</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminOrderModal
