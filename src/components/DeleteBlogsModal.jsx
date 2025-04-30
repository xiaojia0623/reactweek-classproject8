import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DeleteBlogsModal = ({ open, onClose, onConfirm, title }) => {
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Body>你是否要刪除 『<span className="text-danger fw-bold">{title}</span>』？</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          取消
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          刪除
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

DeleteBlogsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default DeleteBlogsModal;