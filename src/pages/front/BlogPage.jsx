import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeatherPointed } from "@fortawesome/free-solid-svg-icons"


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;


const BlogPage = () => {
    const [frontBlogs, setFrontBlogs] = useState([]);
    const [blogTags, setBlogTags] = useState('全部')

    const filteredAllTags = frontBlogs.filter((blog) => {
        if (blogTags === '全部') return blog;

        return blog.tag === blogTags;
    })

    const getAllBlogs = async () => {
        try {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/, "$1");
            //console.log("目前的 token:", token);
            axios.defaults.headers.common.Authorization = token;

            const { data } = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/articles`);

            if (data.articles && data.articles.length > 0) {
                setFrontBlogs(data.articles); // 更新 frontBlogs state
            } else {
                console.log("資料為空或格式錯誤");
            }
            setFrontBlogs(data.articles.filter((item) => item.isPublic === true));
        } catch (error) {
            console.error("獲取資料失敗", error?.response?.data?.message || error);
        }
    };

    useEffect(() => {
        getAllBlogs();
    }, []);
   

  return (
    <div className='container '>
      <div className="row row-cols-1">
        <div className="col col-md-10 pt-3 pt-md-5">
            <h2 className='mb-5 px-3 fw-bold'>熱門文章</h2>
            <div className="mb-5">
                <ul className="list-group list-group-flush blog-list-hot p-md-2" >
                    {frontBlogs?.map((blog) => (
                        <li key={blog.id} className="list-group-item">
                            <div className='d-flex align-items-center justify-content-between'>
                                <h4 className="fw-bold mt-3">{blog.title}</h4>
                                <span>{new Date(blog.create_at * 1000).toLocaleDateString()}</span>
                            </div>
                            <p>作者: {blog.author}</p>
                            <img className='w-100 img-fluid mb-3' src={blog.image} alt={blog.title} />
                            <p className='text-truncate'>
                                {blog.description}
                            </p>
                            <p className='text-truncate'>
                                {blog.content}
                            </p>
                            <Link to={`/blog/${blog.id}`} style={{color:'#353333', textDecoration:'none', justifyContent:'end', display:'flex'}}>more ...</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="col-2 pt-5 d-none d-md-block">
            <div>
                <h4>貼文列表</h4>
                <ul className='list-unstyled'>
                    {filteredAllTags?.map((blogName,index) => (
                        <li key={index} className="hover-underline mb-2">
                            <Link className="text-decoration-none" style={{color:'#838383'}} to={`/blog/${blogName.id}`}><FontAwesomeIcon icon={faFeatherPointed} /> {blogName.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4>標籤列表</h4>
                <ul className='list-unstyled d-flex flex-wrap'>
                    {frontBlogs.map((tagsItem) => (
                        <li key={tagsItem.id} className="mx-2 my-1">
                            <Link onClick={() => setBlogTags(tagsItem.tag)}><span className="badge p-2 rounded-pill text-bg-primary">{tagsItem.tag}</span></Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPage
