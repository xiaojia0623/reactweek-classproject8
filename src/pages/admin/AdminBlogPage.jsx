import { useEffect, useState, useCallback } from 'react';
import AdminBlogModal from '../../components/AdminBlogModal';
import DeleteBlogsModal from '../../components/DeleteBlogsModal';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const PAGE_SIZE = 5;

export default function ArticleAdminPage() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);

  /* modal 狀態 */
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState('create');
  const [current, setCurrent] = useState(null);

  /* delete 狀態 */
  const [delOpen, setDelOpen] = useState(false);

  /* axios token */
  const withAuth = () => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)jiahu0724428\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
  };

  /* get 全部 */
  const fetchAll = useCallback(async () => {
    withAuth();
    const { data } = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/articles`);
    setList(data.articles);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* 取得單篇詳情 */
  const fetchDetail = async (id) => {
    withAuth();
    const { data } = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/article/${id}`);
    return data.article;
  };

  /* save */
  const handleSave = async (payload) => {
    withAuth();
    if (mode === 'create') {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/article`, { data: payload });
    } else {
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/article/${payload.id}`, { data: payload });
    }
    fetchAll();
  };

  /* delete */
  const handleDelete = async () => {
    withAuth();
    await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/article/${current.id}`);
    setDelOpen(false);
    fetchAll();
  };

  /* 當前頁資料 */
  const totalPages = Math.ceil(list.length / PAGE_SIZE);
  const pageList = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container py-4">
      <h2 className="mb-3">文章管理</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setMode('create');
          setCurrent(null);
          setModalOpen(true);
        }}
      >
        新增文章
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>標題</th>
            <th>作者</th>
            <th>日期</th>
            <th>描述</th>
            <th>公開</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {pageList.map((a, i) => (
            <tr key={a.id}>
              <td>{(page - 1) * PAGE_SIZE + i + 1}</td>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{new Date(a.create_at * 1000).toLocaleDateString()}</td>
              <td className="text-truncate" style={{ maxWidth: 180 }}>{a.description}</td>
              <td className={a.isPublic ? 'text-success' : 'text-danger'}>
                {a.isPublic ? '公開' : '未公開'}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={async () => {
                    const detail = await fetchDetail(a.id);
                    setCurrent(detail);
                    setMode('edit');
                    setModalOpen(true);
                  }}
                >
                  編輯
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    setCurrent(a);
                    setDelOpen(true);
                  }}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 分頁 */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Modal */}
      <AdminBlogModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={mode}
        article={current}
        onSave={handleSave}
      />

      <DeleteBlogsModal
        open={delOpen}
        onClose={() => setDelOpen(false)}
        onConfirm={handleDelete}
        title={current?.title}
      />
    </div>
  );
}

