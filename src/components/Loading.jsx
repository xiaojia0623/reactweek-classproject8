import { Atom } from 'react-loading-indicators';

const Loading = () => {
  return (
    <div className='d-flex position-fixed top-50 start-50 translate-middle justify-content-center align-items-center h-100 text-center' 
    style={{ zIndex: 1050, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)"}}>
        <Atom color="#138ebf" size="large" text="Loading..." textColor="#ffffff"/>
    </div>
  )
}

export default Loading