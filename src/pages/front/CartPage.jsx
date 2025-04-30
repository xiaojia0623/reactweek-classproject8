import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom';
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { updateCartData } from '../../redux/cartSlice';
import { pushMessage } from '../../redux/toastSlice';
import Loading from '../../components/Loading';
import Swal from 'sweetalert2';
import Accordion from 'react-bootstrap/Accordion';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const CartPage = () => {
    const [cart, setCart] = useState({});
    const [product, setProduct] = useState([])
    const dispatch = useDispatch();
    const  swiperRef = useRef(null);
    const [coupon, setCoupon] = useState("");
    

    //全螢幕的loading
    const [screenLoading, setScreenLoading] = useState(false);

    const handleApplyCoupon = async (coupon) => {
        try {
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/coupon`,{
                data: {
                code: coupon
                }
            })
            
            Swal.fire({
                    title: "優惠券已套用成功！",
                    icon: "success",
                    draggable: true
                });
        } catch (error) {
          Swal.fire({
            title: '優惠券無效或已過期',
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "確定"
          });
        } finally {
          getCart();
        }
    };

    const calculateCartTotal = (cart = {}) => {
        // 計算小計
        const subtotal = cart.carts?.reduce((sum, item) => {
          return sum + item.final_total;
        }, 0) || 0;
      
        // 計算運費
        const shippingFee = subtotal >= 5000 ? 0 : 150;
      
        // 計算金額（即小計 + 運費）
        const amount = subtotal + shippingFee;
      
        // 計算折扣金額（如果有的話）
        const discountAmount = cart.final_total ? subtotal - cart.final_total : 0;
      
        // 計算折扣百分比
        const discountPercentage = subtotal > 0 ? ((discountAmount / subtotal) * 100).toFixed(2) : 0;
      
        // 計算總計（即金額 - 折扣）
        const total = amount - discountAmount;
      
        return {
          subtotal,
          shippingFee,
          amount,
          discountAmount,
          discountPercentage,
          total
        };
    };
    const { subtotal, shippingFee, discountAmount, amount, total, discountPercentage } = calculateCartTotal(cart);

    const getCart = useCallback(async () => {
        try{
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`)
            setCart(res.data.data);
            dispatch(updateCartData(res.data.data));
        }catch{
            dispatch(pushMessage({ text: '取購物車失敗', status: 'failed' }));
        }
    },[dispatch])

    useEffect(() => {
        getCart();
        
        if (product.length > 0) {
            new Swiper(swiperRef.current, {
                modules: [Autoplay],
                loop: false,
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
        }
    },[getCart, product])

    useEffect(() => {
        const getProducts = async () => {
          try {
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products/all`);
            setProduct(res.data.products);
          } catch (error) {
            const errorMessage = error.response?.data?.message || "請檢查輸入資料";
            dispatch(pushMessage({
                title: "提示",
                text: `取得產品失敗：${errorMessage}`,
                status: "failed"
            }))
          }
        };
        getProducts();
    }, [dispatch]);

    //購物車內的"X"
    const removeCartItem = async(cartItem_id) => {
        setScreenLoading(true)
        try{
            await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`);
            getCart();
        }catch(error){
            Swal.fire({
                icon: 'error',
                title: '刪除失敗',
                text: error.response?.data?.message || '請稍後再試',
            });
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
        }catch {
          //alert('購物車無商品無法清除唷!', error)
          Swal.fire({
            title: 'Error!',
            text: '購物車無商品無法清除唷!',
            icon: 'error',
            confirmButtonText: 'OK'
          })
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
            alert('清除購物車商品失敗', error)
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
                                        <label htmlFor='cartItemQty' hidden></label>
                                        <input
                                            type="text"
                                            id='cartItemQty'
                                            className="form-control border-0 text-center my-auto shadow-none"
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
                        <p>NT$ {subtotal.toLocaleString()}</p>
                    </div>
                    <div className="cart-content d-flex justify-content-between">
                        <p>運費</p>
                        <p>{shippingFee === 0 ? '免運費' : `NT$ ${shippingFee.toLocaleString()}`}
                        </p>
                    </div>
                    <div className="cart-content d-flex justify-content-between">
                        <p>金額</p>
                        <p>NT$ {amount.toLocaleString()}
                        </p>
                    </div>
                    <div className="card-line mb-3"></div>
                    <div className="d-flex justify-content-between pb-3">
                        <p className="fs-10 fw-bold">優惠卷折扣</p>
                        <p className="fs-10 fw-bold">
                        {discountAmount > 0 ? `${discountPercentage}%` : '無折扣'}
                        </p>
                    </div>
                    <p>總計: NT${total.toLocaleString()}</p>
                    {cart.carts?.length === 0 ? (
                    <button className="btn btn-secondary w-100" disabled>
                        結帳
                    </button>
                    ) : (
                    <Link to="/checkout-form" className="btn btn-primary w-100">
                        結帳
                    </Link>
                    )}
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
        <div className="input-group inputCoupon mb-3 align-items-center">
            <label htmlFor="couponcode" className='fs-4 me-2' style={{color:'#474646 '}}>填寫優惠券序號 </label>
            <input
                type="text"
                name='couponcode'
                id='couponcode'
                className="form-control rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none"
                placeholder="Coupon Code"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
            />
            <div className="input-group-append">
                <button
                    className="btn btn-outline-dark border-bottom border-top-0 border-start-0 border-end-0 rounded-0"
                    type="button"
                    id="button-addon2"
                    onClick={() => handleApplyCoupon(coupon)}
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
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>1. 請問產品何時會發貨？</Accordion.Header>
                    <Accordion.Body>
                    <strong>解答：</strong> 當天中午 12 點前下單，當日出貨；12 點後下單，次日出貨。預購商品將依公告時間發貨。
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>2. 如果收到的陶瓷產品破損，該怎麼辦？</Accordion.Header>
                    <Accordion.Body>
                    <strong>解答：</strong> 若商品在運送過程中受損，請於 48 小時內拍照並聯繫客服，我們將免費補寄或退款。
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>3. 是否提供客製化陶瓷訂製服務？</Accordion.Header>
                    <Accordion.Body>
                    <strong>解答：</strong> 是的！我們提供客製化服務，可刻字、彩繪圖案或訂製專屬設計，歡迎聯繫客服討論需求。
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>4. 請問有提供貨到付款嗎？</Accordion.Header>
                    <Accordion.Body>
                    <strong>解答：</strong> 是的，我們提供貨到付款服務，僅適用於本地訂單，付款時請準備現金或支援的電子支付方式。
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                    <Accordion.Header>5. 退換貨政策是什麼？</Accordion.Header>
                    <Accordion.Body>
                    <strong>解答：</strong> 除客製化商品外，所有產品皆享 7 天鑑賞期，請確保商品未使用且包裝完整，聯繫客服辦理退換貨。
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
        {screenLoading && ( <Loading />)}
    </div>
    </>
  )
}

export default CartPage