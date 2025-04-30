import { useEffect, useState } from "react";
import axios from "axios";

import Pagination from '../../components/Pagination';
import { useNavigate } from "react-router-dom";
import AdminCouponModal from '../../components/AdminCouponModal';
import DeleteCouponModal from "../../components/DeleteCouponModal";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  title: "",
  is_enabled: 0,
  percent: 0,
  due_date: new Date(),
  code: ""
};

export default function AdminCouponPage() {
  const [coupons, setCoupons] = useState([]);
  const [tempCoupon, setTempCoupon] = useState(defaultModalState);
  const [modalMode, setModalMode] = useState(null);
  const [pageInfo, setPageInfo] = useState({});

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isDelCouponModalOpen, setIsDelCouponModalOpen] = useState(false);

  const navigate = useNavigate();

  const getCoupons = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/coupons?page=${page}`
      );
      setCoupons(res.data.coupons);
      setPageInfo(res.data.pagination);
      
    } catch {
      Swal.fire({
        title: "取得優惠券失敗",
        icon: "error",
        confirmButtonText: "確定"
      });
    }
  };

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      getCoupons();
    } else {
      Swal.fire({
        title: "請先登入",
        icon: "error",
        confirmButtonText: "確定"
      });
      navigate("/login");
    }
  }, [navigate]);

  const handleOpenCouponModal = (mode, coupon) => {
    setModalMode(mode);

    switch (mode) {
    case "create":
      setTempCoupon({...defaultModalState});
      break;
    case "edit":
      setTempCoupon({
        ...coupon,
        due_date: new Date(coupon.due_date * 1000).toISOString().split("T")[0]
      });
      break;
    default:
      break;
    }

    setIsCouponModalOpen(true);
  };

  const handleOpenDelCouponModal = (coupon) => {
    setTempCoupon(coupon);
    setIsDelCouponModalOpen(true);
  };

  const handlePageChange = (page) => {
    getCoupons(page);
  };

  return (
    <>
      <main className="admin-content container d-flex flex-column justify-content-between">
        <div>
          <div className="py-4 d-flex justify-content-between gap-3">
            <h3>優惠券列表</h3>
            <button
              type="button"
              onClick={() => {
                handleOpenCouponModal("create");
              }}
              className="btn btn-primary"
            >
              新增優惠券
            </button>
          </div>
        </div>
        <div>
          <div className="admin-table-content overflow-y-auto">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">優惠券名稱</th>
                  <th scope="col">折扣碼</th>
                  <th scope="col">折扣百分比</th>
                  <th scope="col">到期日</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <th scope="row">{coupon.title}</th>
                    <td>{coupon.code}</td>
                    <td>{coupon.percent}</td>
                    <td>{(new Date(coupon.due_date*1000)).toLocaleDateString()}</td>
                    <td>
                      {coupon.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          type="button"
                          onClick={() => {
                            handleOpenCouponModal("edit", coupon);
                          }}
                          className="btn btn-outline-primary btn-sm"
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleOpenDelCouponModal(coupon);
                          }}
                          className="btn btn-outline-danger btn-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              pageInfo={pageInfo}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
      <AdminCouponModal
        tempCoupon={tempCoupon}
        getCoupons={getCoupons}
        modalMode={modalMode}
        isOpen={isCouponModalOpen}
        setIsOpen={setIsCouponModalOpen}
      />
      <DeleteCouponModal
        tempCoupon={tempCoupon}
        getCoupons={getCoupons}
        isOpen={isDelCouponModalOpen}
        setIsOpen={setIsDelCouponModalOpen}
      />
    </>
  );
}
