import { useEffect} from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const MySwal = withReactContent(Swal);

const DeleteOrderModal = ({
    deleteOrderModalState,
    tempOrders,
    getOrders,
    isDelOrdersModalOpen,
    setIsDelOrdersModalOpen
    }) => {
    useEffect(() => {
        if (!isDelOrdersModalOpen) return;

        const text =
        deleteOrderModalState === 'deleteSingleOrder'
            ? `確定刪除訂單 #${tempOrders.num} 嗎?`
            : '確定刪除所有訂單? 此動作無法復原!';

        MySwal.fire({
            title: '刪除確認',
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '確定',
            cancelButtonText: '取消',
        }).then(async (result) => {
        if (!result.isConfirmed) {
            setIsDelOrdersModalOpen(false);
            return;
        }

        try {
            if (deleteOrderModalState === 'deleteSingleOrder') {
            await axios.delete(
                `${BASE_URL}/v2/api/${API_PATH}/admin/order/${tempOrders.id}`
            );
            } else {
            await axios.delete(
                `${BASE_URL}/v2/api/${API_PATH}/admin/orders/all`
            );
            }
            MySwal.fire('成功!', '訂單已刪除', 'success');
            getOrders();
        } catch (err) {
            MySwal.fire('失敗', err.response?.data?.message || '刪除失敗', 'error');
        } finally {
            setIsDelOrdersModalOpen(false);
        }
        });
    }, [isDelOrdersModalOpen, deleteOrderModalState, tempOrders.id, tempOrders.num, setIsDelOrdersModalOpen, getOrders]);

    return null;
};

export default DeleteOrderModal