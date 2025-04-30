import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { pushMessage } from '../../redux/toastSlice';
import { updateCartData } from '../../redux/cartSlice';
import axios from 'axios';
import Loading from '../../components/Loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const taiwanRegions = {
  台北市: ['中正區', '大同區', '中山區', '松山區', '大安區'],
  新北市: ['板橋區', '三重區', '中和區', '永和區', '新莊區'],
  台中市: ['中區', '東區', '南區', '西區', '北區'],
};

const CheckoutForm = () => {
  const [cartItem, setCartItem] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //全螢幕的loading
  const [screenLoading, setScreenLoading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const getToken = () => {
    return document.cookie.replace(
      /(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
  };

  //取得購物車內容
  const getCart = useCallback(async () => {
    setScreenLoading(true);
    try {
      const token = getToken();
      axios.defaults.headers.common['Authorization'] = token;
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      const carts = res.data.data.carts;

      // 如果後端成功但 carts 為空
      if (!carts || carts.length === 0) {
        setCartItem([]);
        dispatch(updateCartData([]));
        return; // 不顯示錯誤
      }

      // 整理需要的格式
      const cleanedCart = carts.map(item => ({
        id: item.id,
        product_id: item.product_id,
        title: item.product.title,
        imageUrl: item.product.imageUrl,
        qty: item.qty,
        price: item.product.price,
        total: item.total,
        final_total: item.final_total,
      }));

      setCartItem(cleanedCart);
      dispatch(updateCartData(cleanedCart));
    } catch {
      dispatch(pushMessage({ text: '取得購物車失敗', status: 'failed' }));
    } finally {
      setScreenLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getCart();
  }, [getCart]);

  const subTotal = cartItem.reduce((acc, item) => acc + item.total, 0);
  const finalTotal = cartItem.reduce((acc, item) => acc + item.final_total, 0);
  const discountAmount = subTotal - finalTotal;
  const shippingFee = subTotal >= 5000 ? 0 : 150;
  const calculatedFinalTotal = finalTotal + shippingFee;

  const onSubmit = async data => {
    try {
      const order = {
        data: {
          user: {
            name: data.name,
            email: data.email,
            tel: data.tel,
            id: data.orderId,
            region: data.region,
            district: data.district,
            address: data.address,
            payment: data.payment,
          },
          message: data.message || '',
          cartItems: cartItem,
        },
      };
      const res = await axios.post(
        `${BASE_URL}/v2/api/${API_PATH}/order`,
        order
      );

      localStorage.setItem(
        'orderData',
        JSON.stringify({
          cartItems: cartItem,
          data: order.data,
          orderInfo: res.data.order,
          finalTotal: calculatedFinalTotal,
        })
      );
      localStorage.setItem('orderId', res.data.orderId);

      navigate(`/checkout-payment/${res.data.orderId}`, {
        state: {
          orderId: res.data.orderId,
          discountAmount,
          shippingFee,
          finalTotal: calculatedFinalTotal,
        },
      });
    } catch {
      dispatch(pushMessage({ text: '建立訂單失敗', status: 'failed' }));
    }
  };

  return (
    <div className='container mt-4'>
      <div className='row justify-content-center mt-3 mt-md-5'>
        <div className='col-auto col-md-10'>
          <nav className='navbar'>
            <ul className='d-flex flex-md-row flex-column justify-content-center  list-unstyled mx-auto '>
              <li className='position-relative d-flex align-items-center  me-md-3 '>
                <i className='fas fa-check-circle d-md-inline d-block text-danger'></i>
                <span className='text-nowrap'>填寫表單</span>
                <div className='custom-step-line ms-3 d-none d-md-block'></div>
              </li>
              <div className='vline d-md-none'></div>

              <li className='position-relative d-flex align-items-center me-md-3'>
                <i className='fas fa-dot-circle d-md-inline d-block'></i>
                <span className='text-nowrap'>訂單確認</span>
                <div className='custom-step-line ms-3 d-none d-md-block lineblack'></div>
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
      <h2 className='mb-4'>結帳資料</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='row'>
        {/* 左邊表單 */}
        <div className='col-md-6'>
          <div className='mb-3'>
            <label className='form-label'>姓名 *</label>
            <input
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              {...register('name', { required: '請輸入姓名' })}
            />
            {errors.name && (
              <div className='invalid-feedback'>{errors.name.message}</div>
            )}
          </div>
          <div className='mb-3'>
            <label className='form-label'>Email *</label>
            <input
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register('email', { required: '請輸入 Email' })}
            />
            {errors.email && (
              <div className='invalid-feedback'>{errors.email.message}</div>
            )}
          </div>
          <div className='mb-3'>
            <label className='form-label'>電話 *</label>
            <input
              className={`form-control ${errors.tel ? 'is-invalid' : ''}`}
              {...register('tel', { required: '請輸入電話' })}
            />
            {errors.tel && (
              <div className='invalid-feedback'>{errors.tel.message}</div>
            )}
          </div>

          {/* 地址選擇 */}
          <div className='mb-3'>
            <label htmlFor='region' className='block mb-2'>
              選擇地區 :
            </label>
            <select
              {...register('region', { required: '請選擇地區' })}
              className='form-select border-0'
              id='region'
              name='region'
              onChange={e => {
                const region = e.target.value;
                setSelectedRegion(region);
                setValue('district', ''); // 重置市區
                clearErrors('region'); // 清除錯誤訊息
              }}
            >
              <option value=''>請選擇地區</option>
              {Object.keys(taiwanRegions).map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className='text-danger'>{errors.region.message}</p>
            )}
          </div>

          {/* 選擇市區（根據選擇的地區動態變化） */}
          {selectedRegion && (
            <div className='mb-3'>
              <label htmlFor='district' className='block mb-2'>
                選擇市區
              </label>
              <select
                {...register('district', { required: '請選擇市區' })}
                id='district'
                name='district'
                className='form-select border-0'
              >
                <option value=''>請選擇市區</option>
                {taiwanRegions[selectedRegion].map(district => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className='text-danger'>{errors.district.message}</p>
              )}
            </div>
          )}

          <div className='mb-3'>
            <label htmlFor='address' className='block mb-2'>
              訂購人地址 :
            </label>
            <input
              id='address'
              name='address'
              {...register('address', { required: '地址為必填' })}
              className='form-control border-0'
              placeholder='請填入地址'
            />
            {errors.address && (
              <p className='text-danger'>{errors.address.message}</p>
            )}
          </div>

          <div className='mb-3'>
            <label className='form-label'>支付方式 *</label>
            <select
              className={`form-select ${errors.payment ? 'is-invalid' : ''}`}
              {...register('payment', { required: '請選擇支付方式' })}
            >
              <option value=''>請選擇</option>
              <option value='現金'>現金</option>
              <option value='信用卡'>信用卡</option>
              <option value='Line Pay'>Line Pay</option>
              <option value='Apple Pay'>Apple Pay</option>
            </select>
            {errors.payment && (
              <div className='invalid-feedback'>{errors.payment.message}</div>
            )}
          </div>

          <div className='mb-3'>
            <label className='form-label'>留言（可選）</label>
            <textarea
              className='form-control'
              rows='3'
              {...register('message')}
            ></textarea>
          </div>
        </div>

        {/* 右邊購物車商品總覽 */}
        <div className='col-md-6'>
          <div className='border rounded p-3 bg-light'>
            <h5>訂單資訊</h5>
            {cartItem.map(item => (
              <div
                key={item.id}
                className='d-flex justify-content-between mb-2'
              >
                <div>
                  {item.title} x {item.qty}
                </div>
                <div>NT$ {item.total.toLocaleString()}</div>
              </div>
            ))}
            <hr />
            <div className='d-flex justify-content-between'>
              <div>商品小計</div>
              <div>NT$ {subTotal.toLocaleString()}</div>
            </div>
            <div className='d-flex justify-content-between'>
              <div>運費</div>
              <div>{shippingFee === 0 ? '免運費' : `NT$ ${shippingFee}`}</div>
            </div>
            <div className='d-flex justify-content-between'>
              <div>折扣</div>
              <div>-NT$ {discountAmount.toLocaleString()}</div>
            </div>

            <div className='d-flex justify-content-between fw-bold mt-2'>
              <div className='fw-bold fs-5'>總計</div>
              <div className='fw-bold fs-5'>
                NT$ {calculatedFinalTotal.toLocaleString()}
              </div>
            </div>
            <div className='text-end mt-4 d-flex justify-content-between'>
              <Link
                to='/cart'
                className='icon-link icon-link-hover align-items-center m-0 text-decoration-none'
              >
                <i
                  className='bi bi-chevron-left me-1 d-flex'
                  aria-hidden='true'
                ></i>
                上一步
              </Link>
              <button type='submit' className='btn btn-primary'>
                確定送出，下一步
              </button>
            </div>
          </div>
        </div>
      </form>
      {screenLoading && <Loading />}
    </div>
  );
};

export default CheckoutForm;
