import React from 'react'
import Teapot from '../../components/Teapot'

const AdminHomePage = () => {
  return (
    <div style={{backgroundImage: "url('https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2VyYW1pY3N8ZW58MHx8MHx8fDA%3D')",
      backgroundSize: "cover",backgroundPosition: "center",height: "100vh",
  }}>
      <h1 className='text-center py-5'>歡迎使用後台管理</h1>
      <div className='d-flex justify-content-center '>
        <Teapot />
      </div>
    </div>
  )
}

export default AdminHomePage
