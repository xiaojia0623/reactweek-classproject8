import { useEffect, useState} from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { pushMessage } from '../../redux/toastSlice'
import Pagination from '../../components/Pagination'

import AdminTestBlogModal from '../../components/AdminBlogModal';
import DeleteBlogsModal from '../../components/DeleteBlogsModal';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalBlogsMode = { //modal狀態的預設值
  title:"",
  content:"",
  description:"",
  image:"",
  tag:[],
  create_at:"",
  author:"",
  isPublic:"",
  num:1
};

const formatDueDate = (dueDate) => {
    if (!dueDate) return "";
    // 假設 dueDate 是 Unix timestamp，將其轉換為當地的日期時間格式
    const date = new Date(dueDate * 1000);
    return date.toLocaleString(); // 格式化為本地日期時間
};


const AdminBlogPage = () => {
  const dispatch = useDispatch();
  
  //部落格資料(為陣列)
  const [blogs, setBlogs] = useState([]);
  
  //設為modal狀態預設值
  const [tempBlogs, setTempBlogs] = useState(defaultModalBlogsMode);
  
  const [modalBlogsMode, setModalBlogsMode] = useState(null); //判斷是新增或是 編輯 的狀態
  
  //判斷確認Modal是開還是關，預設為關閉狀態
  const [isBlogsModalOpen, setIsBlogsModalOpen] = useState(false)
  
  //判斷確認刪除Modal是開還是關，預設為關閉狀態
  const [isDelBlogsModalOpen, setIsDelBlogsModalOpen] = useState(false)
  
  const [pageData, setPageData] = useState({})
  
  //換頁功能 判斷當前是第幾頁並取得資料
  const handlePageChange = (page) => {
    getBlogs(page)
  }

  //取得後台部落格資料
  const getBlogs = async (page=1) => {
    try{ //串接部落格api
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/,"$1",);
        axios.defaults.headers.common.Authorization = token;

        const { data } = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/articles?page=${page}`);

        setBlogs(data.articles);
        setPageData(data.pagination);
        dispatch(pushMessage({
            title: "系統提示",
            text: "恭喜! 成功取得文章",
            status: "success"
         }))
    }catch(error) {
        dispatch(pushMessage({
            title: "系統提示",
            text: "文章取得失敗",
            status: "failed"
        }))
    }
  }

  useEffect(() => {
    getBlogs();  // 載入當前頁面資料
  }, []) 

  //打開部落格Modal
  const handleOpenBlogsModal = (mode, blog) => {
    setModalBlogsMode(mode);
    switch(mode) {
    case 'create':
      setTempBlogs(defaultModalBlogsMode);
        break;
    case 'edit':
      setTempBlogs(blog);
        break;
    default:
        break;
    }
    
    //modal的開關
    setIsBlogsModalOpen(true);
  }

  //打開刪除modal
  const handleOpenDelBlogsModal = (blog) => {
    setTempBlogs(blog);
    setIsDelBlogsModalOpen(true);
  }

  

  return (
    <>
        <div className="container mt-2">
          <div className="row">
            <div className="col">
              <div className="admin-product d-flex justify-content-between">
                <h2 className='fs-3 fw-bold'>文章列表</h2>
                <button onClick={() => handleOpenBlogsModal('create')} type='button' className='btn btn-primary'>建立新的文章</button>
              </div>
  
              <table className="table">
                <thead>
                  <tr>
                    <th>編號</th>
                    <th>標題</th>
                    <th>日期</th>
                    <th>內容</th>
                    <th>標籤</th>
                    <th>是否啟用</th>
                    <th>編輯或刪除</th>
                  </tr>
                </thead>
  
                <tbody>
                  {blogs?.map((blog) => (
                    <tr key={blog.id}>
                      <th scope="row">{blog.num}</th>
                      <td>{blog.title}</td>
                      <td>{formatDueDate(blog.create_at)}</td>
                      
                      <td><p className=' text-truncate'  style={{ wordWrap: "break-word", overflowWrap: "break-word", whiteSpace: "normal" }}>{blog.description || "無內容"}</p></td>
                      <td>{Array.isArray(blog.tag) ? blog.tag.join(", ") : "無標籤"}</td>
                      <td>{blog.isPublic ? (<span className="text-success">公開</span>) : <span>未公開</span>}</td>
                      <td>
                      <div className="btn-group" role="group">
                        <button onClick={() => handleOpenBlogsModal('edit', blog)} type="button" className="btn btn-outline-primary">編輯</button>
                        <button onClick={() => handleOpenDelBlogsModal(blog)} type="button" className="btn btn-outline-danger">刪除</button>
                      </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
  
              </table>
            </div>
            
          </div>
          <Pagination getBlogs={getBlogs} pageData={pageData} handlePageChange={handlePageChange}/>
        </div>
        <AdminTestBlogModal getBlogs={getBlogs} tempBlogs={tempBlogs} modalBlogsMode={modalBlogsMode} isOpen={isBlogsModalOpen} setIsOpen={setIsBlogsModalOpen} setTempBlogs={setTempBlogs}/>
        
  
        <DeleteBlogsModal tempBlogs={tempBlogs} getBlogs={getBlogs} isOpen={isDelBlogsModalOpen} setIsOpen={setIsDelBlogsModalOpen}/>
    </>
  )
}

export default AdminBlogPage
