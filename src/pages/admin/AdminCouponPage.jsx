import { useEffect, useState} from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { pushMessage } from '../../redux/toastSlice'
import Pagination from '../../components/Pagination'
import AdminCouponModal from '../../components/AdminCouponModal'
import DeleteCouponModal from '../../components/DeleteCouponModal'

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalCouponMode = { //modal狀態的預設值
    title: "",
    percent: 0,
    due_date: "",
    is_enabled: false,
    code: ""
  };

  // 隨機生成 10 位數字和大寫字母的序號
const generateRandomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const formatDueDate = (dueDate) => {
    if (!dueDate) return "";
    // 假設 dueDate 是 Unix timestamp，將其轉換為當地的日期時間格式
    const date = new Date(dueDate * 1000);
    return date.toLocaleString(); // 格式化為本地日期時間
};
  
const AdminCouponPage = () => {
    const dispatch = useDispatch();

    //優惠券資料(為陣列)
    const [coupons, setCoupons] = useState([]);

    //設為modal狀態預設值
    const [tempCoupons, setTempCoupons] = useState(defaultModalCouponMode);

    const [modalCouponMode, setModalCouponMode] = useState(null); //判斷是新增或是 編輯 的狀態

    //判斷確認Modal是開還是關，預設為關閉狀態
    const [isCouponsModalOpen, setIsCouponsModalOpen] = useState(false)

    //判斷確認刪除Modal是開還是關，預設為關閉狀態
    const [isDelCouponsModalOpen, setIsDelCouponsModalOpen] = useState(false)

  
    //取得後台優惠券資料
    const getCoupons = async (page=1) => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/,"$1",);
        axios.defaults.headers.common.Authorization = token;
        try{ //串接產品api
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/coupons?page=${page}`);
            setCoupons(res.data.coupons);
            setPageData(res.data.pagination);
            dispatch(pushMessage({
                title: "系統提示",
                text: "恭喜! 成功取得優惠券",
                status: "success"
             }))
        }catch(error) {
            dispatch(pushMessage({
                title: "系統提示",
                text: "優惠券取得失敗",
                status: "failed"
            }))
        }
    }

    useEffect(() => {
        getCoupons();
    }, [])

    //打開優惠券Modal
    const handleOpenCouponsModal = (mode, coupons) => {
        setModalCouponMode(mode);

        if (mode === 'create') {
            setTempCoupons({
                title: "",
                percent: 0,
                due_date: "",
                is_enabled: false,
                code: generateRandomCode() // 只有新增時才生成隨機 code
            });
        } else if (mode === 'edit' && coupons) {
            setTempCoupons({
                ...coupons,
                due_date: coupons.due_date ? new Date(coupons.due_date * 1000).toISOString().slice(0, 16)  // 轉換為 "YYYY-MM-DDTHH:MM"
                : ""
                // Math.floor(new Date(coupons.due_date).getTime() / 1000),
            });
        }
        
        //modal的開關
        setIsCouponsModalOpen(true);
    }

    //打開刪除modal
    const handleOpenDelCouponsModal = (coupon) => {
        setTempCoupons(coupon);
        setIsDelCouponsModalOpen(true);
    }

    const [pageData, setPageData] = useState({})

    //換頁功能 判斷當前是第幾頁並取得資料
    const handlePageChange = (page) => {
        getCoupons(page)
    }


  return (
    <>
        <div className="container">
          <div className="row">
            <div className="col mt-5">
              <div className="admin-product d-flex justify-content-between mb-3">
                <h2 className='fs-3 fw-bold'>優惠券列表</h2>
                <button onClick={() => handleOpenCouponsModal('create')} type='button' className='btn btn-primary'>建立新的優惠券</button>
              </div>
  
              <table className="table">
                <thead>
                  <tr>
                    <th>優惠券名稱</th>
                    <th>到期日</th>
                    <th>折扣%數</th>
                    <th>折扣序號</th>
                    <th>是否啟用</th>
                    <th>編輯或刪除</th>
                  </tr>
                </thead>
  
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <th scope="row">{coupon.title}</th>
                      <td>{formatDueDate(coupon.due_date)}</td>
                      <td>{coupon.percent} %</td>
                      <td>{coupon.code}</td>
                      <td>{coupon.is_enabled ? (<span className="text-success">啟用</span>) : <span>未啟用</span>}</td>
                      <td>
                      <div className="btn-group" role="group">
                        <button onClick={() => handleOpenCouponsModal('edit', coupon)} type="button" className="btn btn-outline-primary">編輯</button>
                        <button onClick={() => handleOpenDelCouponsModal(coupon)} type="button" className="btn btn-outline-danger">刪除</button>
                      </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
  
              </table>
            </div>
          </div>
          <Pagination getCoupons={getCoupons} pageData={pageData} handlePageChange={handlePageChange}/>
        </div>
        <AdminCouponModal getCoupons={getCoupons} tempCoupons={tempCoupons} modalCouponMode={modalCouponMode} isOpen={isCouponsModalOpen} setIsOpen={setIsCouponsModalOpen} setTempCoupons={setTempCoupons}/>
        
  
        <DeleteCouponModal tempCoupons={tempCoupons} getCoupons={getCoupons} isOpen={isDelCouponsModalOpen} setIsOpen={setIsDelCouponsModalOpen}/>
    </>
  )
}

export default AdminCouponPage
