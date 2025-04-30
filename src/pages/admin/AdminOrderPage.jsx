import { useEffect, useState} from 'react'
import axios from 'axios'
import Pagination from '../../components/Pagination'
import DeleteOrderModal from '../../components/DeleteOrderModal';
import AdminOrderModal from '../../components/AdminOrderModal';
import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalOrderMode = { //modal狀態的預設值
    id:"",
    title: "",
    create_at:0,
    user: {},
    products:{},
    total: 0 ,
    num: 0,
    message: "",
    is_paid: 0,
};


const AdminOrderPage = () => {

    //訂單資料(為陣列)
    const [orders, setOrders] = useState([]);

    //設為modal狀態預設值
    const [tempOrders, setTempOrders] = useState(defaultModalOrderMode);

    const [modalOrdersMode, setModalOrdersMode] = useState(null); //判斷是新增或是 編輯 的狀態

    //判斷確認Modal是開還是關，預設為關閉狀態
    const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false)

    //判斷確認刪除Modal是開還是關，預設為關閉狀態
    const [isDelOrdersModalOpen, setIsDelOrdersModalOpen] = useState(false)

    //刪除單筆或全部訂單的 modal狀態
    const [deleteOrderModalState, setDeleteOrderModalState] = useState(null);


    const formatDueDate = (dueDate) => {
        if (!dueDate) return "";
        // 假設 dueDate 是 Unix timestamp，將其轉換為當地的日期時間格式
        const date = new Date(dueDate * 1000);
        return date.toLocaleString(); // 格式化為本地日期時間
    };

    useEffect(() => {
        getOrders();
    }, [])

    
    //取得前台訂單資料
    const getOrders = async (page=1) => {
        try{ //串接產品api
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/,"$1",);
            axios.defaults.headers.common.Authorization = token;
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/orders?page=${page}`);
                setOrders(res.data.orders);
                setPageData(res.data.pagination);
        }catch {
            Swal.fire({
                title: "訂單取得失敗!",
                text: "請重新操作一次",
                icon: "error",
                confirmButtonText: "確定"
            });
        }
    }

    
    //打開訂單Modal
    const handleOpenOrdersModal = (mode, order) => {
        setModalOrdersMode(mode);
        switch(mode) {
        case 'create':
            setTempOrders(defaultModalOrderMode);
            break;
        case 'edit':
            setTempOrders(order);
            break;
        default:
            break;
        }
        
        //modal的開關
        setIsOrdersModalOpen(true);
    }

    //打開訂單刪除modal
    const handleOpenDelOrdersModal = (mode, order) => {
        setDeleteOrderModalState(mode)
        if (mode === "deleteSingleOrder"){
            setTempOrders(order);
        }else if (mode === "deleteAllOrders"){
            setTempOrders(defaultModalOrderMode);
        }
        setIsDelOrdersModalOpen(true);
    }

    const [pageData, setPageData] = useState({})

    //換頁功能 判斷當前是第幾頁並取得資料
    const handlePageChange = (page) => {
        getOrders(page)
    }

  return (
    <div>
        <div className="container">
            <div className="row">
                <div className="col mt-5">
                    <div className="admin-product d-flex justify-content-between mb-3">
                        <h2 className='fs-3 fw-bold'>訂單列表</h2>
                        <button onClick={() => handleOpenDelOrdersModal('deleteAllOrders', defaultModalOrderMode)} type='button' className='btn btn-outline-danger'>刪除所有訂單</button> {/* 看看是否改為刪除所有訂單 */}
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>編號</th>
                                <th>訂單號碼</th>
                                <th>客人姓名</th>
                                <th>建立時間</th>
                                <th>訂單付款狀態</th>
                                <th>訂單金額</th>
                                <th>編輯或刪除</th> 
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order, idx) => (
                            <tr key={order.id}>
                                <th scope="row">{idx + 1}</th>
                                <td>CRE{order.id}</td>
                                <td>{order.user.name}</td>
                                <td>{formatDueDate(order.create_at)}</td>
                                <td>{order.is_paid ? (<span className="text-success">已付款</span>) : <span className="text-danger">未付款</span>}</td>
                                <td>$ {order.total.toLocaleString()}</td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button onClick={() => handleOpenOrdersModal('edit', order)} type="button" className="btn btn-outline-primary">編輯</button>
                                        <button onClick={() => handleOpenDelOrdersModal("deleteSingleOrder",order)} type="button" className="btn btn-outline-danger">刪除</button>
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
            <Pagination getOrders={getOrders} pageData={pageData} handlePageChange={handlePageChange}/>
        </div>
        <AdminOrderModal getOrders={getOrders} setOrders={setOrders} tempOrders={tempOrders} modalOrdersMode={modalOrdersMode} isOrdersOpen={isOrdersModalOpen} setIsOrdersOpen={setIsOrdersModalOpen}/>
        

        <DeleteOrderModal deleteOrderModalState={deleteOrderModalState} tempOrders={tempOrders} getOrders={getOrders} isDelOrdersModalOpen={isDelOrdersModalOpen} setIsDelOrdersModalOpen={setIsDelOrdersModalOpen}/>
    </div>
  )
}

export default AdminOrderPage
