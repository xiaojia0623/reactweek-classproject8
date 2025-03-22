import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Teapot from "../../components/Teapot";

const NotFound = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

  return (
    <div className="not-found  justify-content-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2VyYW1pY3N8ZW58MHx8MHx8fDA%3D')",
        backgroundSize: "cover",backgroundPosition: "center",height: "100vh",
    }}>

      <div>
        <h1 className="text-center pt-7">Sorry ! 找不到您要的網頁</h1>
        <h3 className="text-center mt-5"><span>3 秒</span>後馬上為您跳轉至首頁 ...</h3>
      </div>
      <div className='d-block text-center  justify-content-center'>
        <Teapot />
      </div>
      
    </div>
  )
}

export default NotFound
