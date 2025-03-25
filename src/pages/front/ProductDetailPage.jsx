import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { updateCartData } from '../../redux/cartSlice';
import { pushMessage } from '../../redux/toastSlice';
import Loading from '../../components/Loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const ProductDetailPage = () => {

    const [product, setProduct] = useState({});
    const [qtySelect, setQtySelect] = useState(1);
    const dispatch = useDispatch();
    const {id: product_id} = useParams();
    const [screenLoading, setScreenLoading] = useState(false);

    const getCart = useCallback(async () => {
        try{
          const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
          dispatch(updateCartData(res.data.data))
        }catch(error){
          alert('取得購物車失敗', error)
        }
        
        
    }, [dispatch]);
    
    useEffect(() => {
          getCart();
    }, [getCart]);
    

    useEffect(() => {
        const getProduct = async () => {
            setScreenLoading(true)
            try{
                const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/product/${product_id}`);
                setProduct(res.data.product);
            } catch(error){
                alert('取得產品失敗', error)
            }finally{
                setScreenLoading(false)
            }
        }
        getProduct();
    },[product_id])



    const addCartItem = async(product_id, qty) => {
        try{
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`,{
                data:{
                    product_id,
                    qty: Number(qty)
                }
            });
            dispatch(pushMessage({
                title: "系統提示",
                text: `已加入到購物車`,
                status: "success"
            }))
            getCart();
        }catch(error){
            const errorMessage = error.response?.data?.message || "請檢查輸入資料";
            dispatch(pushMessage({
                title: "系統提示",
                text: `加入購物車失敗：${errorMessage}`,
                status: "failed"
            }))
        }
    }  
    



  return (
    <div className='container mt-3  mt-lg-5 '>
        <nav aria-label="breadcrumb" className='mb-3 mb-lg-5'>
            <ol className="breadcrumb px-0 mb-0 py-3">
                <li className="breadcrumb-item">
                    <Link className="text-muted" to="/">
                        首頁
                    </Link>
                </li>
                <li className="breadcrumb-item">
                    <Link className="text-muted" to="/product">
                        產品列表
                    </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                    產品資訊
                </li>
            </ol>
        </nav>

        <div className="row row-cols-1 row-cols-md-2  mb-5 mb-lg-5">
            <div className="col mb-4 mb-md-0">
                <img className='w-100' style={{objectFit:'cover'}} src={product.imageUrl} alt={product.title}/>
            </div>
            <div className="col">
                <div className="d-flex justify-content-start align-items-center">
                    <h4 className='fs-2'>{product.title}</h4>
                    <span className="badge text-bg-success ms-2">{product.category}</span>
                </div>
                <p className='text-danger fs-3'>${product.price}<span className='text-decoration-line-through text-secondary fs-5 ms-3'>${product.origin_price}</span></p>
                <p>宅配: 滿5000免運費，運費150元</p>
                <p>付款: 現金、信用卡、LinePay、超商</p>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="input-group my-3 bg-light rounded">
                            <div className="input-group-prepend">
                                <button
                                onClick={() => setQtySelect(qtySelect - 1)}
                                className="btn btn-outline-dark border-0 py-2"
                                type="button"
                                disabled={ qtySelect === 1}
                                id="button-addon1"
                                >
                                <i className="fas fa-minus"></i>
                                </button>
                            </div>
                            <input
                                type="text"
                                className="form-control border-0 text-center my-auto shadow-none bg-light"
                                placeholder=""
                                aria-label="Example text with button addon"
                                aria-describedby="button-addon1"
                                value={qtySelect}
                            />
                            <div className="input-group-append">
                                <button
                                onClick={() => setQtySelect(qtySelect + 1)}
                                className="btn btn-outline-dark border-0 py-2"
                                type="button"
                                id="button-addon2"
                                >
                                <i className="fas fa-plus"></i>
                                
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-6">
                        <button type='button' onClick={() => addCartItem(product.id, qtySelect)} className='btn btn-outline-primary'>加入購物車</button>
                    </div>
                </div>
            </div>
            <div >
                <h5 className="card-title my-3 fs-4 fw-bold">更多圖片：</h5>
                <div className='d-flex flex-column align-items-center flex-md-row p-0' style={{width:'100%', height: '100%', gap:'10px'}}>{product.imagesUrl?.map((image) => (image && (<img key={image} src={image} className="img-fluid rounded-2"  style={{width:'300px', height: '250px', gap:'10px'}}/>)))}</div>
            </div>
        </div>

        <div className="product-intro mb-5 mb-md-5">
            <h4 className='text-center mb-5 mb-md-5 fw-bold fs-2'>產品介紹</h4>
            <h5 className='text-start mb-4 fw-bold fs-4'>產品故事</h5>
            <p className='text-start fs-5'>
            {product.description}
            </p>
            <p className='text-start text-danger fw-bold'>
            {product.content === "無" ?  product.content : ''}
            </p>
        </div>
        {screenLoading && (<Loading />)}
    </div>
  )
}

export default ProductDetailPage
