import { useEffect, useState, useCallback} from 'react'
import axios from 'axios'
import Pagination from '../../components/Pagination'
import AdminProductModal from '../../components/AdminProductModal';
import DeleteProductModal from '../../components/DeleteProductModal';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalMode = { //modal狀態的預設值
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""]
};


const AdminProducts = () => {
  //產品資料(為陣列)
  const [products, setProducts] = useState([]);

  //設為modal狀態預設值
  const [tempProduct, setTempProduct] = useState(defaultModalMode);

  const [modalMode, setModalMode] = useState(null); //判斷是新增或是 編輯 的狀態

  //判斷確認Modal是開還是關，預設為關閉狀態
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  //判斷確認刪除Modal是開還是關，預設為關閉狀態
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false)
  const dispatch = useDispatch();
  
  //取得後台產品資料
  const getProducts = useCallback(async (page=1) => {
    try{ //串接產品api
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`);
        setProducts(res.data.products);
        setPageData(res.data.pagination);
    }catch(error) {
      const errorMessage = error.response?.data?.message || "請檢查輸入資料";
        dispatch(pushMessage({ title: "錯誤", text: `產品取得失敗：${errorMessage}`, status: "failed" }));
    }
  }, [dispatch])

  useEffect(() => {
    getProducts();
  }, [getProducts])

  //打開產品Modal
  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    
    switch(mode) {
    case 'create':
        setTempProduct(defaultModalMode);
        break;

    case 'edit':
        setTempProduct(product);
        break;

    default:
        break;
    }
    
    //modal的開關
    setIsProductModalOpen(true);
  }

  //打開刪除modal
  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);
    setIsDelProductModalOpen(true);
  }

  const [pageData, setPageData] = useState({})

  //換頁功能 判斷當前是第幾頁並取得資料
  const handlePageChange = (page) => {
    getProducts(page)
  }

  return (
    <div style={{backgroundImage: "url('https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2VyYW1pY3N8ZW58MHx8MHx8fDA%3D')",
      backgroundSize: "cover",backgroundPosition: "center",height: "100vh"}}>
      <div className="container">
        <div className="row">
          <div className="col mt-5">
            <div className="admin-product d-flex justify-content-between mb-3">
              <h2 className='fs-3 fw-bold'>產品列表</h2>
              <button onClick={() => handleOpenProductModal('create')} type='button' className='btn btn-primary'>建立新的產品</button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>商品名稱</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>是否啟用</th>
                  <th>編輯或刪除</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>$ {product.origin_price}</td>
                    <td>$ {product.price}</td>
                    <td>{product.is_enabled ? (<span className="text-success">啟用</span>) : <span>未啟用</span>}</td>
                    <td>
                    <div className="btn-group" role="group">
                      <button onClick={() => handleOpenProductModal('edit', product)} type="button" className="btn btn-outline-primary">編輯</button>
                      <button onClick={() => handleOpenDelProductModal(product)} type="button" className="btn btn-outline-danger">刪除</button>
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
        <Pagination pageData={pageData} handlePageChange={handlePageChange}/>
      </div>
      <AdminProductModal getProducts={getProducts} tempProduct={tempProduct} modalMode={modalMode} isOpen={isProductModalOpen} setIsOpen={setIsProductModalOpen}/>
      

      <DeleteProductModal tempProduct={tempProduct} getProducts={getProducts} isOpen={isDelProductModalOpen} setIsOpen={setIsDelProductModalOpen}/>
    </div>
  )
}

export default AdminProducts
