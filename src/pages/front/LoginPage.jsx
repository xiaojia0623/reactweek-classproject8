import {  useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import axios from 'axios'
import AdminHomePage from '../admin/AdminHomePage'
import { useDispatch } from 'react-redux'
import { pushMessage } from '../../redux/toastSlice'

const BASE_URL = import.meta.env.VITE_BASE_URL

const LoginPage = () => {
     const dispatch = useDispatch();
    //登入狀態，目前預設為false，若登入後就會是true狀態
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();
    //綁定帳號以及預設值
    const [account, setAccount] = useState({
        username:'',
        password:''
    })

    //監聽輸入input事件，將myAccount綁定到事件內
    const handleInputChange = (e) => {
        const {value, name} = e.target;
        setAccount({
        ...account,
        [name]: value
        });
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const res = await axios.post(`${BASE_URL}/v2/admin/signin`,account);
            const {token, expired} = res.data;

            //將token存進cookie裡面
            document.cookie = `jiahu0724428=${token}; expires=${new Date(expired)}`;

            //發動請求時headers都會帶上token
            axios.defaults.headers.common['Authorization'] = token;
            
            dispatch(pushMessage({
                title: "系統提示",
                text: "驗證登入成功",
                status: "success"
            }))
            setIsLogin(true); //若已登入的狀態則顯示true
            navigate("/admin/home")
        }catch(error){
            dispatch(pushMessage({
                title: "系統提示",
                text: error?.response?.data?.message || '登入有誤，請檢查帳號或密碼',
                status: "failed"
            }))
        }

    }


  return (
    <>
    {isLogin ? <AdminHomePage /> : (
        <div className="login" style={{backgroundImage: "url('https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2VyYW1pY3N8ZW58MHx8MHx8fDA%3D')",
            backgroundSize: "cover",backgroundPosition: "center",height: "100vh",
        }}>
            <div className="container">
                <form onSubmit={(e) => handleLogin(e)}>
                    <h3 className='text-center fw-bold'>請登入</h3>
                    <div className="form-floating mb-3">
                        <input name='username' type="email" onChange={handleInputChange} className="form-control" id="floatingInput" placeholder="name@example.com" />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input name='password'  type="password" onChange={handleInputChange} className="form-control" id="floatingPassword" placeholder="Password" />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <button className="btn btn-primary w-100 mb-3">登入</button>
                </form>
            </div>
        </div>
    )}
    </>
  )
}

export default LoginPage
