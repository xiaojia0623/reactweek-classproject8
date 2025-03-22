import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { pushMessage } from '../redux/toastSlice'
import { Modal } from 'bootstrap'

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const AdminProductModal = ({modalMode, tempProduct, isOpen, setIsOpen, getProducts}) => {

    const productModalRef = useRef(null); //使用useRef取得DOM數(預設值null，綁定在DOM)
    const fileInputRef = useRef(null); // 給 input type="file" 的 ref
    const [modalData, setModalData] = useState(tempProduct) //tempProduct這邊作為初始值
    const dispatch = useDispatch();

    useEffect(() => { //當tempProduct有變化時，modalData也跟著變動
        setModalData({
            ...tempProduct
        })
    }, [tempProduct])

    useEffect(() => {
        //畫面渲染後取得 DOM 建立modal
        new Modal(productModalRef.current, {
        backdrop: false  //關閉點擊其他地方可將modal關閉
        });
    }, [])

    useEffect(()=> { //判斷是否要開啟
        if (isOpen) {
            const modalInstance = Modal.getInstance(productModalRef.current);
            modalInstance.show(); 
        }
    },[isOpen])

    //串接 新增產品api
    const createProduct = async () => {
        try{
            await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
                data: {
                ...modalData,
                origin_price: Number(modalData.origin_price),
                price: Number(modalData.price),
                is_enabled: modalData.is_enabled ? 1 : 0
                }
            })
            //alert('恭喜! 新增成功');
            dispatch(pushMessage({
                title: "系統提示",
                text: "恭喜! 新增成功",
                status: "success"
            }))
            

            handleCloseProductModal();
        }catch (error) {
            //alert('新增產品失敗，請檢查輸入資料');
            dispatch(pushMessage({
                title: "系統提示",
                text: "新增產品失敗，請檢查輸入資料",
                status: "failed"
            }))
            
            setIsProductModalOpen(true);
        }
    }

    //圖片上傳
    const handleFileChange = async (e) => {
    
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file-to-upload', file)
    
        try{
            const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`, formData);
            const uploadImageUrl = res.data.imageUrl;
            setModalData({
                ...modalData,
                imageUrl: uploadImageUrl
            })
        }catch (error) {
            console.error(error)
        }
    }

    //多圖區新增按鈕
    const handleAddImage = () => {
        const newImages = [...modalData.imagesUrl, ''];

        setModalData({
        ...modalData,
        imagesUrl: newImages
        })
    }
    //多圖區刪除按鈕
    const handleRemoveImage = () => {
        const newImages = [...modalData.imagesUrl];

        newImages.pop()

        setModalData({
        ...modalData,
        imagesUrl: newImages
        })
    }


    //model內的input監聽事件，呼叫此函式
    const handleModalInputChange = (e) => {
        const {value, name, checked, type} = e.target;
        setModalData({
            ...modalData,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    //判斷第幾個index新增圖片，監聽input內change事件
    const handleImageChange = (e, index) => {
        const {value} = e.target;
        const newImages = [...modalData.imagesUrl];
        newImages[index] = value;
        setModalData({
          ...modalData,
          imagesUrl: newImages
        })
    }

    //串接 編輯產品api
    const updateProduct = async () => {
        try{
            await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${modalData.id}`, {
                data: {
                ...modalData,
                origin_price: Number(modalData.origin_price),
                price: Number(modalData.price),
                is_enabled: modalData.is_enabled ? 1 : 0
                } 
            });
            dispatch(pushMessage({
                title: "系統提示",
                text: "恭喜! 編輯成功",
                status: "success"
            }))
            
        }catch (error) {
            dispatch(pushMessage({
                title: "系統提示",
                text: "編輯產品失敗",
                status: "failed"
            }))
        }
    }

    //關閉產品Modal
    const handleCloseProductModal = () => {
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.hide(); //關閉modal
        setModalData({imageUrl: "", title:"", category:"", unit:"", origin_price:"", price:"", description:"", content:"", is_enabled:"", imgupdate:""})
        
        // 清空 input file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setIsOpen(false)
    }

    //更新產品資料
    const handleUpdateProduct = async () => {
        const apiCall = modalMode === 'create' ? createProduct() : updateProduct();
        try{
            await apiCall;
            getProducts();
            handleCloseProductModal();
        }catch (error) {
            alert('更新產品失敗')
        }
    }



  return (
    <div ref={productModalRef} className="modal" id='productsModal'>
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{modalMode === 'create' ? '新增產品' : '編輯產品'}</h5>
                    <button type="button" onClick={handleCloseProductModal} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                

                <div className="modal-body">
                    <div className="row">
                        <div className="col-md-4">
                            
                            <div className="input-group mb-3">
                                <label className="form-label" htmlFor="fileInput">圖片上傳</label>
                                <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" name="imgupdate"  onChange={handleFileChange} className="form-control" id="fileInput" />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="" className="form-label">主圖</label>
                                <div className="input-group mb-2">
                                <input value={modalData.imageUrl} onChange={handleModalInputChange} type="text" name="imageUrl" id='primary-image' className="form-control" placeholder='請輸入圖片連結'/>
                                </div>
                                <img src={modalData.imageUrl} alt={modalData.title} className="img-fluid" />
                            </div>

                            {/* 副圖 */}
                            <div className="p-3">
                                {modalData.imagesUrl?.map((image,index) => (
                                    <div key={index} className="mb-2">
                                        <label htmlFor={`imagesUrl-${index + 1}`} className="form-label">副圖 {index + 1}</label>
                                        <input value={image} onChange={(e) => handleImageChange(e, index)} id={`imagesUrl-${index + 1}`} type="text" className="form-control mb-2" placeholder={`圖片網址 ${index + 1}`}/>
                                        {image && (
                                            <img src={image} alt={`副圖 ${index + 1}`} className="img-fluid mb-3" />
                                        )}
                                    </div>
                                ))}
                                <div className="btn-group w-100">
                                    {modalData.imagesUrl?.length < 5 && 
                                    modalData.imagesUrl[modalData.imagesUrl?.length - 1] !== "" && (
                                    <button onClick={handleAddImage} className="btn btn-outline-primary btn-sm w-100">新增圖片</button>
                                )}
                                {modalData.imagesUrl?.length > 1 && (<button onClick={handleRemoveImage} className="btn btn-outline-danger btn-sm w-100">取消圖片</button>)}
                                </div>
                            </div>
                            
                        </div>

                        <div className="col-md-8">
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">標題</label>
                                <input value={modalData.title}  name='title' onChange={handleModalInputChange} type="text" className="form-control" id="title" placeholder='請輸入標題' required/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="category" className="form-label">分類</label>
                                <input value={modalData.category} name='category' onChange={handleModalInputChange} type="text" className="form-control" id="category" placeholder='請輸入分類' required/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="unit" className="form-label">單位</label>
                                <input value={modalData.unit} name='unit' onChange={handleModalInputChange} type="text" className="form-control" id="unit" placeholder='請輸入單位' required/>
                            </div>

                            <div className="row mb-3">
                                <div className="col-6">
                                <label htmlFor="origin_price" className="form-label">原價</label>
                                <input min={0} value={modalData.origin_price} name='origin_price' onChange={handleModalInputChange} type="number" className="form-control" id="origin_price" placeholder='請輸入原價'/>
                                </div>

                                <div className="col-6">
                                <label htmlFor="price" className="form-label">售價</label>
                                <input min={0} value={modalData.price} name='price' onChange={handleModalInputChange} type="number" className="form-control" id="price" placeholder='請輸入售價'/>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">產品描述</label>
                                <textarea value={modalData.description}  row={10} cols={30} onChange={handleModalInputChange} name="description" id="description" className="form-control" placeholder='請輸入產品描述'></textarea>
                            </div>

                            <div className="mb-3 d-flex flex-column">
                                <label htmlFor="content" className="form-label">說明內容</label>
                                <textarea value={modalData.content} row={10} cols={30}  name="content" onChange={handleModalInputChange} id="content" className='form-control' placeholder='請輸入說明內容'></textarea>
                            </div>

                            <div className="form-check">
                                <input checked={modalData.is_enabled} onChange={handleModalInputChange} name='is_enabled' type="checkbox" className="form-check-input" id="isEnabled" />
                                <label htmlFor="isEnabled" className="form-check-label">是否啟用</label>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="modal-footer">
                    <button onClick={handleCloseProductModal} type="button" className="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button onClick={handleUpdateProduct} type="button" className="btn btn-primary">確認</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminProductModal
