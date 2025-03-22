
import { Link, useNavigate } from 'react-router-dom';

const CheckoutSuccess = () => {

  return (
    <div className="success-bg" style={{backgroundImage:"url(https://images.unsplash.com/photo-1633000116322-d7f5cb7d3ebb?q=80&w=1951&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        backgroundRepeat:"no-repeat", minHeight:"100vh", backgroundPosition:"center center"
    }}>
        <div className='container'>
            <div className="row justify-content-center pt-3 pt-md-5">
                <div className="col-auto col-md-10">
                    <nav className="navbar">
                        <ul className='d-flex flex-md-row flex-column justify-content-center  list-unstyled mx-auto '>
                            <li className='position-relative d-flex align-items-center  me-md-3 '>
                                <i className='fas fa-check-circle d-md-inline d-block text-danger'></i>
                                <span className='text-nowrap'>填寫表單</span>
                                <div className="custom-step-line ms-3 d-none d-md-block"></div>
                            </li>
                            <div className='completeline d-md-none'></div>

                            <li className='position-relative d-flex align-items-center me-md-3'>
                                <i className='fas fa-check-circle d-md-inline d-block text-danger'></i>
                                <span className='text-nowrap'>付款方式</span>
                                <div className="custom-step-line ms-3 d-none d-md-block"></div>
                            </li>
                            <div className='completeline d-md-none'></div>

                            <li className='d-flex align-items-center'>
                                <i className='fas fa-check-circle d-md-inline d-block text-danger'></i>
                                <span className='text-nowrap'>訂單完成</span>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className='row my-auto pb-7 justify-content-center'>
                <div className="col-md-11 d-flex flex-column">
                    <div className="my-auto">
                        <h2 className='text-center'>訂單已成立，感謝您光臨!</h2>

                        <Link to="/" className='d-flex justify-content-center mt-5'>
                            <button className="btn btn-primary" type='button'>回首頁</button>
                        </Link>
                        
                    </div>
                </div>
            </div>


        </div>
    </div>
  )
}

export default CheckoutSuccess
