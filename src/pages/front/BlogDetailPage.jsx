import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios";
import {  useParams } from "react-router-dom";
import Loading from '../../components/Loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const BlogDetailPage = () => {

  const [frontDetailBlog, setFrontDetailBlog] = useState([]);
  const [screenLoading, setScreenLoading] = useState(false);
  const {id: article_id} = useParams();

  useEffect(() => {
    const getBlogs = async () => {
        setScreenLoading(true)
        try{
          const { data } = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/article/${article_id}`);
          console.log("文章詳細資料:", data.article); 
            setFrontDetailBlog(data.article);
        } catch(error){
            alert('取得產品失敗')
            console.error("獲取文章詳情失敗", error);
        }finally{
            setScreenLoading(false)
        }
    }
    getBlogs();
  }, [article_id])


  return (
    <>
    <div className="container">
      <nav aria-label="breadcrumb" className='mb-3 mb-lg-3 mt-5'>
        <ol className="breadcrumb px-0 mb-0 py-3">
          <li className="breadcrumb-item">
            <Link className="text-muted" to="/">首頁</Link>
          </li>
          <li className="breadcrumb-item">
            <Link className="text-muted" to="/blog">部落格文章列表</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
          部落格文章
          </li>
        </ol>
      </nav>
    </div>

    <div className='container mb-5'>
      {frontDetailBlog && (
      <>
        <div className='d-flex align-items-center justify-content-between'>
          <h4>{frontDetailBlog.title}</h4>
          <span>日期: {new Date(frontDetailBlog.create_at * 1000).toLocaleDateString()}</span>
        </div>
        <p>作者: {frontDetailBlog.author}</p>
        <img className='w-100 img-fluid mb-3' src={frontDetailBlog.image} alt={frontDetailBlog.title} />
        <div>
          <p>{frontDetailBlog.content}</p>
          <p>{frontDetailBlog.description}</p>
        </div>
      </>
      )}
    </div>
    {screenLoading && ( <Loading />)}
    </>
  )
}

export default BlogDetailPage
