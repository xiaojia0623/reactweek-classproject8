import React,{ useEffect, useState } from 'react'
import { useNavigate, Link  } from "react-router-dom"; // 引入 useNavigate
import { useDispatch } from 'react-redux';
import { pushMessage } from '../../redux/toastSlice';
import { useForm} from "react-hook-form";
import InputMask from "react-input-mask";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const taiwanRegions = {
    "台北市": ["中正區", "大同區", "中山區", "松山區", "大安區"],
    "新北市": ["板橋區", "三重區", "中和區", "永和區", "新莊區"],
    "台中市": ["中區", "東區", "南區", "西區", "北區"],
};
  
const paymentOptions = ["現金", "信用卡", "LinePay", "ApplePay"];

const TestCheckoutForm = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm();

    const [cartItem, setCartItem] = useState({});
    const [orderFormData, setOrderFormData] = useState(null);

    const navigate = useNavigate(); // 初始化 useNavigate
    const dispatch = useDispatch();


    const [selectedRegion, setSelectedRegion] = useState("");
    const selectedPayment = watch("paymentMethod");

    //取得購物車清單
    const getCartList = async() => {
        try{
            const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
            setCartItem(res.data.data);
        }catch(error) {
            alert('取得失敗')
        }
    }

    useEffect(() => {
        getCartList();
    },[])



    const onSubmit = (data) => {
        setOrderFormData(data);  // 儲存資料
        // 儲存資料到 sessionStorage，避免在頁面重新加載時丟失
        sessionStorage.setItem("orderFormData", JSON.stringify(data));

        console.log("提交的資料:", data);

        // 導向到結帳頁面
        navigate("/checkout-payment");
    };


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
    <div className='container'>
        <div className="row justify-content-center mt-3 mt-md-5">
            <div className="col-auto col-md-10">
                <nav className="navbar">
                    <ul className='d-flex flex-md-row flex-column justify-content-center  list-unstyled mx-auto '>
                        <li className='position-relative d-flex align-items-center  me-md-3 '>
                            <i className='fas fa-check-circle d-md-inline d-block text-danger'></i>
                            <span className='text-nowrap'>填寫表單</span>
                            <div className="custom-step-line ms-3 d-none d-md-block"></div>
                        </li>
                        <div className='vline d-md-none'></div>

                        <li className='position-relative d-flex align-items-center me-md-3'>
                            <i className='fas fa-dot-circle d-md-inline d-block'></i>
                            <span className='text-nowrap'>訂單確認</span>
                            <div className="custom-step-line ms-3 d-none d-md-block lineblack"></div>
                        </li>
                        <div className='vline d-md-none'></div>

                        <li className='d-flex align-items-center'>
                            <i className='fas fa-dot-circle d-md-inline d-block'></i>
                            <span className='text-nowrap'>訂單完成</span>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
      
        <div className="row row-cols-1 row-cols-md-2 align-items-start mb-5">
            <div className="col col-md-6">
                <h2 className='fw-bold m-0'>填寫訂購相關資料</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-2 ">
                    {/* 個人資訊 */}
                    <div className='mb-3'>
                        <label htmlFor='name' className="block mb-2 fw-bold">訂購人姓名 : </label>
                        <input {...register("name", { required: "姓名為必填" })} id='name' name='name' className="form-control border-0" placeholder="請填入姓名"/>
                        {errors.name && <p className="text-danger">{errors.name.message}</p>}
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='email' className="block mb-2">訂購人Email : </label>
                        <input type="email" id='email' name='email' {...register("email", { required: "Email 為必填", pattern: { value: /\S+@\S+\.\S+/, message: "請輸入有效的 Email" } })}
                        className="form-control border-0 " placeholder="請填入Email"/>
                        {errors.email && <p className="text-danger">{errors.email.message}</p>}
                    </div>

                    {/* 聯絡資訊 */}
                    <div className='mb-3'>
                        <label htmlFor='phone' className="block mb-2">訂購人手機 :</label>
                        <input type="tel" id='phone' name='phone' maxLength={10} {...register("phone", {
                            required: "手機號碼為必填",
                            pattern: {
                            value: /^09\d{8}$/,
                            message: "手機號碼格式錯誤 (09 開頭，總共 10 碼)"
                            },
                        })} className="form-control border-0" placeholder="請填入手機" />
                        {errors.phone && <p className="text-danger">{errors.phone.message}</p>}
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='paymentMethod' className="block mb-2">選擇付款方式 :</label>
                        <select id='paymentMethod' name='paymentMethod' {...register("paymentMethod", { required: "請選擇付款方式" })} className="form-select border-0">
                        <option value="">請選擇付款方式</option>
                        {paymentOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                        </select>
                        {errors.paymentMethod && <p className="text-danger">{errors.paymentMethod.message}</p>}
                    </div>

                    {/* 信用卡號（僅信用卡時顯示） */}
                    {selectedPayment === "信用卡" && (
                        <>
                        <div className="mb-3">
                            <label htmlFor='creditCard' className="block">信用卡號</label>
                            <InputMask
                                {...register("creditCard", {
                                    required: "信用卡號為必填",
                                    pattern: {
                                    value: /^(\d{4}[- ]){3}\d{4}$/,
                                    message: "信用卡號格式錯誤，應為 XXXX-XXXX-XXXX-XXXX",
                                    },
                                })}
                                mask="9999-9999-9999-9999"
                                id="creditCard"
                                className="form-control border-0"
                                placeholder="請輸入信用卡號"
                            />
                            {errors.creditCard && <p className="text-danger">{errors.creditCard.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cvv" className="block mb-2">卡片背面 3 位數字 (CVV) :</label>
                            <input
                                {...register("cvv", {
                                    required: "CVV為必填",
                                    pattern: {
                                    value: /^[0-9]{3,4}$/,
                                    message: "CVV格式錯誤，應為 3 或 4 位數字",
                                    },
                                })}
                                id="cvv"
                                type="password"
                                maxLength={4}
                                className="form-control border-0"
                                placeholder="請輸入卡片背面 3 或 4 位數字"
                            />
                            {errors.cvv && <p className="text-danger">{errors.cvv.message}</p>}
                        </div>
                        </>
                    )}
                    

                    {/* 地址選擇 */}
                    <div className='mb-3'>
                        <label htmlFor='region' className="block mb-2">選擇地區 :</label>
                        <select
                        {...register("region", { required: "請選擇地區" })}
                        className="form-select border-0"
                        id='region' name='region'
                        onChange={(e) => {
                            const region = e.target.value;
                            setSelectedRegion(region);
                            setValue("district", ""); // 重置市區
                            clearErrors("region"); // 🔥 清除錯誤訊息
                        }}
                        >
                        <option value="">請選擇地區</option>
                        {Object.keys(taiwanRegions).map((region) => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                        </select>
                        {errors.region && <p className="text-danger">{errors.region.message}</p>}
                    </div>

                    {/* 選擇市區（根據選擇的地區動態變化） */}
                    {selectedRegion && (
                        <div className='mb-3'>
                            <label htmlFor='district' className="block mb-2">選擇市區</label>
                            <select {...register("district", { required: "請選擇市區" })} id='district' name='district' className="form-select border-0">
                                <option value="">請選擇市區</option>
                                {taiwanRegions[selectedRegion].map((district) => (
                                <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                            {errors.district && <p className="text-danger">{errors.district.message}</p>}
                        </div>
                    )}

                    <div className='mb-3'>
                        <label htmlFor='address' className="block mb-2">訂購人地址 :</label>
                        <input id='address' name='address' {...register("address", { required: "地址為必填" })} className="form-control border-0"  placeholder="請填入地址"/>
                        {errors.address && <p className="text-danger">{errors.address.message}</p>}
                    </div>

                    {/* 留言 */}
                    <div className="mb-3">
                        <label htmlFor="message" className="block mb-2">留言 :</label>
                        <textarea
                        {...register("message", { maxLength: { value: 500, message: "留言不能超過 500 字" } })}
                        id="message"
                        className="form-control border-0"
                        placeholder="請填入留言 (選填)"
                        rows={4}  // 設定 textarea 高度
                        />
                        {errors.message && <p className="text-danger">{errors.message.message}</p>}
                    </div>


                    <div className="mt-3 d-flex justify-content-between">
                        <Link to="/cart" className="icon-link icon-link-hover align-items-center m-0 text-decoration-none">
                            <i className="bi bi-chevron-left me-1 d-flex" aria-hidden="true"></i>
                            上一步
                        </Link>
                        <button type="submit" className="btn btn-primary">
                            確定送出，下一步
                        </button>
                    </div>
                </form>
            </div>

            <div className="col col-md-6">
                <h4 className='fs-2 fw-bold'>訂單明細</h4>
                <div className="card">
                    {cartItem?.carts?.map((item) => (
                        <ul key={item.id} className="card-body list-group">
                            <li className="list-group-item d-flex justify-content-between border-0">
                                <div className='d-flex gap-2'>
                                    <img src={item.product.imageUrl} alt={item.product.title} className='rounded-2 ' style={{width:'100px', height:'100px'}}/>
                                    <p className='fs-4 fw-bold'>{item.product.title}</p>
                                    <p className='fs-5'>{item.qty}{item.product.unit}</p>
                                </div>
                                <hr/>
                                <div>
                                    <p>金額: NT$ {item.final_total} 元</p>
                                </div>
                            </li>
                        </ul>
                    ))}
                    <div className='pt-2 ps-2'>
                        <p className='fs-4 fw-bold'>總金額: NT$ {cartItem.total} 元</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TestCheckoutForm
