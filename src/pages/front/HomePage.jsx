import { useRef, useEffect,useState } from 'react';
import axios from "axios";
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Loading from '../../components/Loading';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

AOS.init();

AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
    initClassName: 'aos-init', // class applied after initialization
    animatedClassName: 'aos-animate', // class applied on animation
    useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
    
  
    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 120, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 400, // values from 0 to 3000, with step 50ms
    easing: 'ease', // default easing for AOS animations
    once: false, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
  
});

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const HomePage = () => {
    const  swiperRef = useRef(null);

    const [homeProducts, setHomeProducts] = useState([]);

    //全螢幕的loading
    const [screenLoading, setScreenLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const getProducts = async () => {
          setScreenLoading(true)
          try {
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
            setHomeProducts(res.data.products);
          } catch (error) {
            const errorMessage = error.response?.data?.message || "請檢查輸入資料";
            dispatch(pushMessage({ title: "錯誤", text: `取得產品失敗：${errorMessage}`, status: "failed" }));
          } finally{
            setScreenLoading(false)
          }
        };
        getProducts();
    }, [dispatch]);

    useEffect(() => {
        new Swiper(swiperRef.current, {
            modules: [Autoplay],
            loop: true,
            autoplay: {
              delay: 3000,
              disableOnInteraction: false,
            },
            slidesPerView: 2,
            spaceBetween: 10,
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
    })
  return (
    <>
        <div className='container mb-5' data-aos="fade-down">
            <div className="row align-items-center home-top-banner">
                <div className="col-md-6 col-12">
                    <h1 className="home-banner-text text-center fw-bold">幸福悠閒 儉約素樸 現代優雅</h1>
                </div>
                <div className="col-md-6 col-12 p-md-auto p-0">
                    <img className=' animate__animated  ' width={'100%'} src="https://firebasestorage.googleapis.com/v0/b/react-ecommerce-contact-97bdb.appspot.com/o/ANL_7793.jpg?alt=media&token=fe05357e-033e-4d04-8c4b-ba1e3500264c" alt="" />
                </div>
            </div>
        </div>

        <div className="container">
            <h2 className='text-center fw-bold mb-5'data-aos="fade-down">創意工藝</h2>
            <Link to="/product" className='icon-link icon-link-hover align-items-center bg-none m-0 text-decoration-none  fs-5'>去看看<i className="bi bi-chevron-right ms-1 d-flex"  aria-hidden="true"></i></Link>
            <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 mt-3  '  data-aos="fade-right">
                <div className='col'>
                    <div className="card border-0 h-100">
                        <div className='overflow-hidden'>
                            <img style={{height:'375px', objectFit:'cover'}} src="https://firebasestorage.googleapis.com/v0/b/homework2mission.appspot.com/o/%E8%9E%8D%E5%90%88%E9%A4%90%E5%85%B7%E7%B5%842-1.jpg?alt=media&token=c89e0a75-9c43-4f52-b3a4-62ada63b0bed" className="card-img-top img-hover" alt="融合餐具組" />
                        </div>
                        
                        <div className="card-body">
                            <h4 className="card-text fw-bold">融合餐具組</h4>
                            <p className="card-content">幾何方型與三角的組合,如七巧板般可任意組合搭配...
                            </p>
                        </div>
                    </div>
                </div>

                <div className='col'>
                    <div className="card border-0 h-100">
                        <div className='overflow-hidden'>
                            <img style={{height:'375px', objectFit:'cover'}} src="https://storage.googleapis.com/vue-course-api.appspot.com/jiahu0724428/1742647306959.jpg" className="card-img-top img-hover" alt="台灣變色杯" />
                        </div>
                        
                        <div className="card-body">
                            <h4 className="card-text fw-bold">台灣變色杯</h4>
                            <p className="card-content">以現代簡約斜方體特殊造型設計，訴求台...</p>
                        </div>
                    </div>
                </div>

                <div className='col'>
                    <div className="card border-0 h-100">
                        <div className='overflow-hidden'>
                            <img style={{height:'375px', objectFit:'cover'}} src="https://firebasestorage.googleapis.com/v0/b/react-ecommerce-contact-97bdb.appspot.com/o/ANL_7616-1.jpg?alt=media&token=44b6ea96-b971-454d-a9c9-513ac72bb926" className="card-img-top img-hover" alt="甘樂壺" />
                        </div>
                        
                        <div className="card-body">
                            <h4 className="card-text fw-bold">甘樂壺</h4>
                            <p className="card-content">孩提時的童玩—陀螺，台語發音『甘樂』</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='home-feature-products'>
            <h2 className='text-center fw-bold mb-5'>精選產品</h2>
            
            <div className="container " data-aos="fade-right">
            <Link to="/product" className='icon-link icon-link-hover align-items-center bg-none m-0 text-decoration-none  fs-5'>去看看<i className="bi bi-chevron-right ms-1 d-flex"  aria-hidden="true"></i></Link>
                <div ref={swiperRef} className="swiper mt-4">
                    <div className="swiper-wrapper">
                        {homeProducts.map((homeProductItem) => (
                            <div className="swiper-slide" key={homeProductItem.id}>
                                <div className="card border-0 mb-4 position-relative" >
                                    <Link to={`/product/${homeProductItem.id}`}>
                                        <div className=' h-100' style={{height:'auto', overflow:'hidden'}}>
                                            <img src={homeProductItem.imageUrl} className="card-img-top rounded-0 rounded-top img-hover" style={{height: '400px',width:"100%", objectFit:'cover'}} alt={homeProductItem.title}/>
                                        </div>
                                    </Link>
                                    {/* <a href="#" className="text-dark"></a> */}
                                    <div className="card-body p-3">
                                        <h4 className="mb-3 mt-3">
                                            <Link to={`/product/${homeProductItem.id}`} className='text-dark text-decoration-none'>{homeProductItem.title}</Link>
                                        </h4>
                                        <p className="card-text mb-0 text-danger fs-4">
                                            NT${homeProductItem.price}
                                            <span className="text-muted ms-3 fs-6">
                                                <del>NT${homeProductItem.origin_price}</del>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="home-buttom-banner">
            <h3 className='text-center'>極簡設計，細品陶瓷之韻。</h3>
            <h4 className='text-center'>A minimalist design, savoring the charm of ceramics.</h4>
        </div>
        {screenLoading && ( <Loading />)}
    </>
  )
}

export default HomePage
