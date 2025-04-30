import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';

const empty = {
  id: '',
  title: '',
  create_at: '',
  image: '',
  imageUrl:'',
  description: '',
  author:'',
  content: '',
  tag: '',
  isPublic: false,
};

export default function AdminBlogModal({ open, onClose, mode, article, onSave }) {
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (open) {
        const url = article?.image || '';
        setImagePreview(url);
        setImagePreview(article?.image || '');
      setForm(
        article
          ? {
              ...article,
              tag: article.tag?.join(', ') || '',
              create_at: new Date(article.create_at * 1000).toISOString().slice(0, 16),
            }
          : empty
      );
      setErr('');
    }
  }, [open, article]);



  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'image') setImagePreview(value);
  };

  const validate = () => {
    const { title, create_at, description, content, tag } = form;
    if (!title || !create_at || !description || !content || !tag) {
      setErr('除「是否公開」外，其餘欄位必填');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      ...form,
      tag: form.tag.split(',').map((t) => t.trim()),
      create_at: Math.floor(new Date(form.create_at).getTime() / 1000),
    };
    onSave(payload);
    onClose();
  };

  return (
    <Modal show={open} onHide={onClose} backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{mode === 'edit' ? '編輯文章' : '新增文章'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-flex gap-3'>
        <div className='w-100'>
          <Form.Group className="mb-3">
            <Form.Label>主圖</Form.Label>
            {/* 圖片連結輸入框 */}
            <div className="input-group mb-2">
                <Form.Control
                type="text"
                name="image"
                placeholder="請輸入圖片連結"
                value={form.image}
                onChange={change}
                />
            </div>

            {/* 圖片預覽 */}
            {imagePreview && (
                <img src={imagePreview} alt={form.title} className="img-fluid rounded" />
            )}
          </Form.Group>
        </div>

        <div className='w-100'>
          {err && <div className="alert alert-danger py-2">{err}</div>}
          {[
            { label: '標題', name: 'title' },
            { label: '作者', name: 'author' },
            { label: '日期', name: 'create_at', type: 'datetime-local' },
            { label: '描述', name: 'description' },
            { label: '標籤(逗號)', name: 'tag' },
            ].map((f) => (
              <Form.Group key={f.name} className="mb-2">
                <Form.Label>{f.label}</Form.Label>
                <Form.Control
                  type={f.type || 'text'}
                  name={f.name}
                  value={form[f.name]}
                  onChange={change}
                />
              </Form.Group>
              ))}
              <Form.Group className="mb-2">
                <Form.Label>內容</Form.Label>
                <Form.Control as="textarea" rows={4} name="content" value={form.content} onChange={change} />
              </Form.Group>
              <Form.Check
                type="checkbox"
                label="是否公開"
                name="isPublic"
                checked={form.isPublic}
                onChange={change}
              />
        </div>

        
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          取消
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {mode === 'edit' ? '更新' : '新增'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

AdminBlogModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  article: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};
