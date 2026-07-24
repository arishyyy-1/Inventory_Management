import { Trash2 } from 'lucide-react';
import Button from './ui/Button.jsx';
import Modal from './ui/Modal.jsx';

const DeleteConfirmationModal = ({ product, isDeleting, onCancel, onConfirm }) => {
  if (!product) return null;
  return (
    <Modal isOpen={Boolean(product)} onClose={onCancel} title="Delete product">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger-soft text-danger">
          <Trash2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-fg">Delete product?</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            This will permanently remove <strong className="text-fg">{product.productName}</strong>{' '}
            from your inventory.
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" icon={Trash2} onClick={onConfirm} isLoading={isDeleting}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
