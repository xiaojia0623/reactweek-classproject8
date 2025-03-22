import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { pushMessage } from '../redux/toastSlice'
import { Modal } from 'bootstrap'

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;


const AdminTestBlogModal = ({modalBlogsMode, tempBlogs, isOpen, setIsOpen, getBlogs}) => {
    const blogsModalRef = useRef(null); //使用useRef取得DOM數(預設值null，綁定在DOM)
    const fileInputRef = useRef(null); // 給 input type="file" 的 ref
    const [modalBlogsData, setModalBlogsData] = useState(tempBlogs) //tempProduct這邊作為初始值
    const [tagInput, setTagInput] = useState(""); // 暫存使用者輸入的標籤
    const dispatch = useDispatch();


    useEffect(() => { //當tempBlogs有變化時，modalCouponData也跟著變動
        setModalBlogsData({
            ...tempBlogs
        })
    }, [tempBlogs])

    useEffect(() => {
        //畫面渲染後取得 DOM 建立modal
        new Modal(blogsModalRef.current, {
        backdrop: false  //關閉點擊其他地方可將modal關閉
        });
    }, [])

    useEffect(()=> { //判斷是否要開啟
        if (isOpen) {
            const modalInstance = Modal.getInstance(blogsModalRef.current);
            modalInstance.show(); 
        }
    },[isOpen])

    // 轉換 due_date 為字串格式
    const formatDueDate = (dueDate) => {
        if(!dueDate) {
            return "";
        }else if (isNaN(Number(dueDate))){
            return dueDate;
        }
        return new Date(dueDate * 1000).toISOString().split("T")[0];
    };


    //圖片上傳
    const handleFileChange = async (e) => {
    
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file-to-upload', file)
    
        try{
            const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`, formData);
            const uploadImage = res.data.image;
            setModalBlogsData({
                ...modalBlogsData,
                image: uploadImage
            })
        }catch (error) {
            console.error(error)
        }
    }

    //判斷第幾個index新增圖片，監聽input內change事件
    const handleImageChange = (e, index) => {
        const {value} = e.target;
        const newImages = [...modalBlogsData.image];
        newImages[index] = value;
        setModalBlogsData({
        ...modalBlogsData,
        image: newImages
        })
    }


    //串接 新增文章api
    const createBlogs = async () => {
        try{
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/,"$1",);
            axios.defaults.headers.common.Authorization = token;

            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/article`, {
                data: {
                    ...modalBlogsData,
                    create_at: Math.floor(new Date().getTime() / 1000),
                    isPublic: modalBlogsData.isPublic === true || modalBlogsData.isPublic === "true" ? true : false // 確保後端需要的是數字
                }
            })
            dispatch(pushMessage({
                title: "系統提示",
                text: "恭喜! 新增優惠券成功",
                status: "success"
            }))
            handleCloseBlogsModal();
        }catch (error) {
            dispatch(pushMessage({
                title: "系統提示",
                text: "新增產品失敗，請檢查輸入資料",
                status: "failed"
            }))
            setIsBlogsModalOpen(true);
        }
    }

    //model內的input監聽事件，呼叫此函式
    const handleModalInputChange = (e) => {
        const {value, name, checked, type} = e.target;
        setModalBlogsData({
            ...modalBlogsData,
            [name]: type === "checkbox" ? checked : value,
        })
    }


    //串接 編輯文章api
    const updateBlogs = async () => {
        try{
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/,"$1",);
            axios.defaults.headers.common.Authorization = token;
            await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/article/${tempBlogs.id}`, {
                data: {
                    ...modalBlogsData,
                    content: modalBlogsData.content,
                    create_at: Math.floor(new Date(modalBlogsData.create_at).getTime() / 1000), 
                    isPublic: modalBlogsData.isPublic === true || modalBlogsData.isPublic === "true" ? true : false // 確保後端需要的是數字
                }
            });
            dispatch(pushMessage({
                title: "系統提示",
                text: "恭喜! 編輯成功",
                status: "success"
            }))
            handleCloseBlogsModal();
        }catch (error) {
            dispatch(pushMessage({
                title: "系統提示",
                text: "編輯優惠券失敗",
                status: "failed"
            }))
        }
    }



    // 處理輸入框變更
    const handleTagChange = (e) => {
        setTagInput(e.target.value); // 更新 tagInput 狀態
    };

    // 處理標籤輸入
    const handleTagKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault(); // 避免換行或輸入 `,` 時異常
            if (tagInput.trim() !== "") {
                setModalBlogsData((prevData) => ({
                    ...prevData,
                    tag: [...(prevData.tag || []), tagInput.trim()], // 確保 tag 是陣列
                }));
                setTagInput(""); // 清空輸入框
            }
        }
    };

    // 刪除標籤
    const handleRemoveTag = (tagToRemove) => {
        setModalBlogsData((prevData) => ({
            ...prevData,
            tag: prevData.tag.filter((tag) => tag !== tagToRemove), // 移除標籤
        }));
    };

    //關閉文章Modal
    const handleCloseBlogsModal = () => {
        const modalInstance = Modal.getInstance(blogsModalRef.current);
        modalInstance.hide(); //關閉modal
        setModalBlogsData({title: "", percent: 0, due_date: "", is_enabled: 0, code: ""})

        // 清空 input file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setIsOpen(false)
    }
    //更新文章資料
    const handleUpdateBlogs = async () => {
        const apiCall = modalBlogsMode === 'create' ? createBlogs() : updateBlogs();
        try{
            await apiCall();
            setIsBlogsModalOpen(false);
            getBlogs();

            dispatch(pushMessage({
                title: "系統提示",
                text: "更新優惠券券成功",
                status: "success"
            }))
        }catch (error) {
            dispatch(pushMessage({
                title: "系統提示",
                text: "更新優惠券失敗",
                status: "failed"
            }))
        }
    }

  return (
    <div ref={blogsModalRef} className="modal" id='productsModal'>
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{modalBlogsMode === 'create' ? '新增文章' : '編輯文章'}</h5>
                    <button type="button" onClick={handleCloseBlogsModal} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                

                <div className="modal-body">
                    <div className="row">
                        <div className="col-md-4">
                            
                            <div className="input-group mb-3">
                                <label className="form-label" htmlFor="image">圖片上傳</label><br/>
                                <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" name="image"  onChange={handleFileChange} className="form-control" id="image" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="primary-image" className="form-label">主圖</label>
                                <div className="input-group mb-2">
                                <input value={modalBlogsData.image} onChange={handleModalInputChange} type="text" name="image" id='primary-image' className="form-control" placeholder='請輸入圖片連結'/>
                                </div>
                                <img src={modalBlogsData.image} alt={modalBlogsData.title} className="img-fluid" />
                            </div>

                            {/* 副圖 */}
                            <div className="p-3">
                                {modalBlogsData.imagesUrl?.map((image,index) => (
                                    <div key={index} className="mb-2">
                                        <label htmlFor={`imagesUrl-${index + 1}`} className="form-label">副圖 {index + 1}</label>
                                        <input value={image} onChange={(e) => handleImageChange(e, index)} id={`imagesUrl-${index + 1}`} type="text" className="form-control mb-2" placeholder={`圖片網址 ${index + 1}`}/>
                                        {image && (
                                            <img src={image} alt={`副圖 ${index + 1}`} className="img-fluid mb-3" />
                                        )}
                                    </div>
                                ))}
                                <div className="btn-group w-100">
                                    {modalBlogsData.imagesUrl?.length < 5 && 
                                    modalBlogsData.imagesUrl[modalBlogsData.imagesUrl?.length - 1] !== "" && (
                                    <button onClick={handleAddImage} className="btn btn-outline-primary btn-sm w-100">新增圖片</button>
                                )}
                                {modalBlogsData.imagesUrl?.length > 1 && (<button onClick={handleRemoveImage} className="btn btn-outline-danger btn-sm w-100">取消圖片</button>)}
                                </div>
                            </div>
                            
                        </div>

                        <div className="col-md-8">
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">標題</label>
                                <input value={modalBlogsData.title}  name='title' onChange={handleModalInputChange} type="text" className="form-control" id="title" placeholder='請輸入標題' required/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="author" className="form-label">作者</label>
                                <input value={modalBlogsData.author} name='author' onChange={handleModalInputChange} type="text" className="form-control" id="author" placeholder='請輸入作者名' required/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="create_at" className="form-label">日期</label>
                                <input value={modalBlogsData.create_at ? formatDueDate(modalBlogsData.create_ate): ""} name='create_at' onChange={handleModalInputChange} type="datetime-local" className="form-control" id="create_at" required/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="tag" className="form-label">標籤</label>
                                <input id="tag" name="tag" type="text" className="form-control" placeholder="輸入標籤後按 Enter 或 ," value={tagInput}
                                    onChange={handleTagChange} onKeyDown={handleTagKeyDown}
                                />
                                <div className="mt-2">
                                    {Array.isArray(modalBlogsData?.tag) && modalBlogsData.tag.map((tag, index) => (
                                        <span key={index} className="badge bg-primary me-2">
                                            {tag}{" "}
                                            <button type="button" className="btn-close btn-close-white ms-1" onClick={() => handleRemoveTag(tag)} aria-label="Close"></button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">故事描述</label>
                                <textarea value={modalBlogsData.description}  row={10} cols={30} onChange={handleModalInputChange} name="description" id="description" className="form-control" placeholder='請輸入故事描述'></textarea>
                            </div>

                            <div className="mb-3 d-flex flex-column">
                                <label htmlFor="content" className="form-label">內容</label>
                                <textarea value={modalBlogsData.content} row={10} cols={30}  name="content" onChange={handleModalInputChange} id="content" className='form-control' placeholder='請輸入內容'></textarea>
                            </div>

                            <div className="form-check">
                                <input checked={modalBlogsData.isPublic} onChange={handleModalInputChange} name='isPublic' type="checkbox" className="form-check-input" id="isPublic" />
                                <label htmlFor="isPublic" className="form-check-label">是否啟用</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={handleCloseBlogsModal} type="button" className="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button onClick={handleUpdateBlogs} type="button" className="btn btn-primary">確認</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminTestBlogModal
