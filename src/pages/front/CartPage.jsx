import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { updateCartData } from '../../redux/cartSlice';
import Loading from '../../components/Loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const CartPage = () => {
    const [cart, setCart] = useState({});
    const [product, setProduct] = useState([])

    // 優惠券狀態
    const [couponCode, setCouponCode] = useState(""); // 優惠券輸入框
    const [percent, setPercent] = useState(); // 優惠折扣（例如 10%）

    const dispatch = useDispatch();
    const  swiperRef = useRef(null);

    const navigate = useNavigate();

    //全螢幕的loading
    const [screenLoading, setScreenLoading] = useState(false);

    //取得後台優惠券折扣%與序號
    

    const getCart = async() => {
        try{
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`)
            setCart(res.data.data);
            dispatch(updateCartData(res.data.data));
        }catch(error){
            alert('取購物車失敗')
        }
    }

    useEffect(() => {
        getCart();
        
        new Swiper(swiperRef.current, {
            modules: [Autoplay],
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            slidesPerView: 3,
            spaceBetween: 20,
            breakpoints: {
              1280: {
                slidesPerView:3,
              },
              768: {
                slidesPerView: 2,
              },
              600: {
                slidesPerView: 1,
              },
              200: {
                slidesPerView: 1,
              },
            },
        });
    },[])

    useEffect(() => {
        const getProducts = async () => {
          try {
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
            setProduct(res.data.products);
          } catch (error) {
            alert("取得產品失敗");
          }
        };
        getProducts();
    }, []);

    //購物車內的"X"
    const removeCartItem = async(cartItem_id) => {
        setScreenLoading(true)
        try{
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`);
            getCart();
        }catch(errror){
            alert('刪除失敗')
        }finally{
            setScreenLoading(false)
        }
    }

    //清空購物車
    const removeCart = async () => {
        setScreenLoading(true)
        try{
          await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`)
          getCart();
        }catch (error){
          alert('清除購物車失敗')
        }finally{
          setScreenLoading(false)
        }
    }


    //購物車商品數量
    const cartItemProduct = async(cartItem_id, product_id,qty) => {
        try{
            await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`,{
                data:{
                    product_id,
                    qty: Number(qty)
                }
            })
            getCart();
        }catch(error){
            alert('清除購物車商品失敗')
        }
    }

    //結帳
    const checkout = async(data) => {
        setScreenLoading(true)
        try{
          await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data)
          setCart({})

          dispatch(pushMessage({
            title: "提示",
            text: "訂單送出成功",
            status: "success"
          }))
          reset()
        }catch (error){
          //alert('結帳失敗')
          dispatch(pushMessage({
            title: "提示",
            text: "訂單送出失敗",
            status: "failed"
          }))

        }finally{
          setScreenLoading(false)
        }
    }



  return (
    <>
    <div className='container mt-3 mt-md-5 mb-3 mb-md-5 p-2'>
        <div className='d-flex justify-content-between align-items-center'>
            <h2 className='text-start fw-bold mb-5'>您的購物車</h2>
            <button type='button' onClick={removeCart} className="btn btn-outline-danger">清空購物車</button>
        </div>
        <div className="cart-info mb-5 d-flex justify-content-md-between flex-column flex-md-row gap-3 gap-md-5">
                {cart.carts?.length > 0 ? (
                <table className="table cart-table mb-5 mb-md-0 h-100">
                    <thead>
                        <tr>
                            <th scope="col" className='fs-5'>商品名稱</th>
                            <th scope="col" className='fs-5 d-none d-md-block'>商品圖</th>
                            <th scope="col" className='fs-5'>數量</th>
                            <th scope="col" className='fs-5'>單價</th>
                            <th scope="col" className='fs-5'>刪除</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.carts?.map((cartItem) => (
                            <tr key={cartItem.id} className='text-center'>
                                <th scope="row">
                                    <p>{cartItem.product.title}</p>
                                </th>
                                <td className=' d-none d-md-block h-100'>
                                    <img src={cartItem.product.imageUrl} alt={cartItem.product.title} style={{width: "72px",height: "72px",objectFit: "cover"}}/>
                                </td>
                                <td
                                    className="border-0 align-middle"
                                    style={{ maxWidth: "160px" }}
                                >
                                    <div className="input-group pe-5">
                                        <div className="input-group-prepend">
                                            <button
                                            onClick={() => cartItemProduct(cartItem.id, cartItem.product.id, cartItem.qty - 1)}
                                            disabled={cartItem.qty === 1 }
                                            className="btn btn-outline-dark border-0 py-2"
                                            type="button"
                                            id="button-addon1"
                                            >
                                            <i className="fas fa-minus"></i>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control border-0 text-center my-auto shadow-none"
                                            placeholder=""
                                            aria-label="Example text with button addon"
                                            aria-describedby="button-addon1"
                                            value={cartItem.qty}
                                            onChange={(e) => cartItemProduct(cartItem.id, cartItem.product.id, Number(e.target.value))}
                                        />

                                        <div className="input-group-append">
                                            <button
                                            onClick={() => cartItemProduct(cartItem.id, cartItem.product.id, cartItem.qty + 1)}
                                            className="btn btn-outline-dark border-0 py-2"
                                            type="button"
                                            id="button-addon2"
                                            >
                                            <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-0 align-middle">
                                    <p className="mb-0 ms-auto">{cartItem.final_total}</p>
                                </td>
                                <td className="border-0 align-middle">
                                    <button
                                    onClick={() => removeCartItem(cartItem.id)}
                                    className="btn btn-outline-dark border-0 py-2"
                                    type="button"
                                    id="button-addon2"
                                    >
                                    <i className="fas fa-times"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>) : (
                <div>
                    <h3 className='text-center'>目前購物車沒有產品喔! 再去逛逛吧!</h3>
                </div>)}

                

            <div className="card cart-card">
                <div className="card-body">
                    <h5 className="card-title fw-bold fs-2 mb-3">訂單資訊</h5>
                    <div className="cart-content d-flex justify-content-between">
                        <p>小計</p>
                        <p>NT$ {cart.total}</p>
                    </div>
                    <div className="cart-content d-flex justify-content-between">
                        <p>運費</p>
                        <p>{cart.total >= 5000 ? '免運費' : `+150`}</p>
                    </div>
                    <div className="card-line mb-3"></div>
                    <p>總計: NT$ {cart.carts?.length === 0 ? 0 : (cart.total >= 5000 ? cart.final_total : cart.final_total + 150)}</p>
                    {/* {cart.total >= 5000 ? cart.final_total : cart.final_total + 150} */}
                    <Link to="/checkout-form" className="btn btn-primary w-100">結帳</Link>
                    <hr/>
                    <h5>購買注意事項:</h5>
                    <ol>
                        <li>
                            <h6>檢查表面與瑕疵 🔍</h6>
                            <p>購買前仔細檢查陶瓷表面是否有裂紋、氣泡、釉面不均或缺角等瑕疵，確保品質完好。</p>
                        </li>
                        <li>
                            <h6>確認材質與用途 🍽️</h6>
                            <p>不同陶瓷材質適用於不同用途，例如高溫燒製的瓷器較耐熱，適合微波爐或洗碗機，而手工陶器則可能需要手洗保養。</p>
                        </li>
                        <li>
                            <h6>妥善包裝與運輸 📦</h6>
                            <p>陶瓷商品易碎，購買時請確保店家提供安全包裝，運輸過程中避免碰撞，以防商品破損。</p>
                        </li>
                    </ol>
                </div>
            </div>
            
        </div>
        <div className="input-group w-50 mb-3 align-items-center">
            <label htmlFor="couponcode" className='fs-4 me-2' style={{color:'#474646 '}}>填寫優惠券序號 </label>
            <input
                type="text"
                name='couponcode'
                id='couponcode'
                className="form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none"
                placeholder="Coupon Code"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"
            />
            <div className="input-group-append">
                <button
                    className="btn btn-outline-dark border-bottom border-top-0 border-start-0 border-end-0 rounded-0"
                    type="button"
                    id="button-addon2"
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
        <h2 className='text-start fw-bold mb-5'>其他熱門產品</h2>

        <div ref={swiperRef} className="cart-swiper mb-5">
            <div className="swiper-wrapper">
                {product?.map((productItem) => (
                    <div key={productItem.id} className="swiper-slide card"  style={{height:'500px', border:'none'}}>
                        <Link to={`/product/${productItem.id}`} style={{ textDecoration: 'none'}}>
                            <div style={{height:'400px', overflow:'hidden'}}> 
                                <img className='img-fluid rounded-top img-hover' style={{height:'400px',  width:'100%', objectFit:'cover'}} src={productItem.imageUrl} alt={productItem.title} />
                            </div>
                            <div className="title-container">
                                <h3>{productItem.title}</h3>
                            </div >

                            <div className="description single-ellipsis">
                                {productItem.description}
                            </div>
                        </Link>
                    </div>
                ))}

            </div>
        </div>

        <h2 className='text-start fw-bold mb-5'>有問題就該詢問 ...</h2>
        <div className="cart-faq mb-5">
            <h3 className='text-center fw-bold fs-1'>FAQ</h3>
            <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            1. 請問產品何時會發貨？
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>解答：</strong> 當天中午 12 點前下單，當日出貨；12 點後下單，次日出貨。預購商品將依公告時間發貨。
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            2. 如果收到的陶瓷產品破損，該怎麼辦？
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>解答：</strong> 若商品在運送過程中受損，請於 48 小時內拍照並聯繫客服，我們將免費補寄或退款。
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            3. 是否提供客製化陶瓷訂製服務？
                        </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>解答：</strong> 是的！我們提供客製化服務，可刻字、彩繪圖案或訂製專屬設計，歡迎聯繫客服討論需求。
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                            4. 請問有提供貨到付款嗎？
                        </button>
                    </h2>
                    <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>解答：</strong> 是的，我們提供貨到付款服務，僅適用於本地訂單，付款時請準備現金或支援的電子支付方式。
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                            5. 退換貨政策是什麼？
                        </button>
                    </h2>
                    <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>解答：</strong> 除客製化商品外，所有產品皆享 7 天鑑賞期，請確保商品未使用且包裝完整，聯繫客服辦理退換貨。
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {screenLoading && ( <Loading />)}
    </div>
    </>
  )
}

export default CartPage
