import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { updateCartData } from '../../redux/cartSlice';
import { pushMessage } from "../../redux/toastSlice";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [qtySelect, setQtySelect] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [selectCategory, setSelectCategory] = useState('全部');
  const [loadingProductId, setLoadingProductId] = useState(null); 

  //全螢幕的loading
  const [screenLoading, setScreenLoading] = useState(false);

  const getAllProducts = async (page=1) => {
    setScreenLoading(true)
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products?page=${page}`);
      setProducts(res.data.products);
      setPageData(res.data.pagination);
      
    } catch (error) {
      alert("取得產品失敗");
    } finally{
      setScreenLoading(false)
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);


  const addCartItem = async (product_id, qty, title) => {
    setScreenLoading(true)
    setLoadingProductId(product_id); // 記錄目前正在加入購物車的產品 ID
    try{
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`,{
        data:{
          product_id,
          qty:Number(qty)
        }
      })
      dispatch(updateCartData({
        title: "系統提示",
        text: `已加入 ${title} 到購物車`,
        status: "success"
      }))
      // dispatch(pushMessage({
      //   title: "系統提示",
      //   text: `已加入 ${title} 到購物車`,
      //   status: "success"
      // }))
      //alert('加入購物車成功')
    }catch (error){
      //alert('加入購物車失敗')
      dispatch(updateCartData({
        title: "系統提示",
        text: "加入購物車失敗",
        status: "failed"
      }));
      // dispatch(pushMessage({
      //   title: "系統提示",
      //   text: "加入購物車失敗",
      //   status: "failed"
      // }));

    }finally{
      setScreenLoading(false)
      setLoadingProductId(null); // 加入完成後，重置 loading 狀態
    }
  }
  const categories =['全部', ...new Set(products.map((product) => product.category))];
  const filteredAllProducts = products.filter((product) => {
    if (selectCategory === '全部') return product;

    return product.category === selectCategory;
  })

  //page 分頁區域
  const [pageData, setPageData] = useState({})

  //換頁功能 判斷當前是第幾頁並取得資料
  const handlePageChange = (page) => {
    getAllProducts(page);
  }

  return (
    <>
    <h2 className='text-center mt-md-5 mt-3 mb-md-5 mb-3'>所有商品</h2>
    <div className="container mb-5">
      <div className="row">
        {/* 左邊側欄 */}
        <div className="col-md-2 mb-md-0 mb-5">
          <h4 className='text-center'>分類 :</h4>
          <ul className="products-category w-100 p-0 " >
            {categories.map((category) => (
              <li key={category}><button type='button' onClick={() => setSelectCategory(category)} className='btn btn-secondary border-none mb-3 py-2 w-100'>{category}</button></li>
            ))}
          </ul>
        </div>

        {/* 右邊產品欄 */}
        <div className="col-md-10">
          <div className="row flex-wrap g-4 row-cols-1 row-cols-sm-2 row-cols-lg-3 ">
            {filteredAllProducts.map((product) => (
              <div className="col-md-3 col" key={product.id}>
                <div className="card h-100 flex-column border-0">
                  <Link to={`/product/${product.id}`} style={{textDecoration:'none', color:'black', fontWeight:'bold', overflow:'hidden'}} className=" w-100"><img src={product.imageUrl} className="card-img-top img-fluid  img-hover" alt={product.title} style={{width:"350px",height:'370px', objectFit:'cover'}}/></Link>
                  <div className="card-body">
                    <h5 className="card-title fw-bold fs-4">
                      <Link to={`/product/${product.id}`} style={{textDecoration:'none', color:'black', fontWeight:'bold'}}>{product.title}</Link>
                    </h5>
                    <p className="card-text single-ellipsis">{product.description}</p>
                    <div className="d-flex justify-content-between flex-column flex-md-row mt-auto">
                      <button type='button' className="btn btn-secondary mb-3 mb-md-0 me-md-3  w-100">
                        <Link to={`/product/${product.id}`} style={{textDecoration:'none', color:'white', fontWeight:'bold'}}>查看內容</Link>
                        </button>
                      <button type='button' onClick={() => addCartItem(product.id, qtySelect, product.title)} className="btn btn-primary  w-100">加入購物車</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination handlePageChange={handlePageChange} pageData={pageData} />
        </div>
      </div>
      {screenLoading && ( <Loading />)}
    </div>
    </>
  )
}

export default ProductPage
