import '../styles/deleteModal.style.css';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }: ConfirmDeleteModalProps) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="delete-modal-overlay" onClick={onClose}>
            <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-modal-header">
                    <h2>Delete Contact</h2>
                </div>
                <div className="confirm-modal-body">
                    <p>Are you sure you want to delete this contact?.</p>
                    <p>This action cannot be undone.</p>
                </div>
                <div className="confirm-modal-actions">
                    <button type="button" className="confirm-cancel-button" onClick={onClose}>
                        CANCEL
                    </button>
                    <button type="button" className="confirm-delete-button" onClick={handleConfirm}>
                        DELETE
                    </button>
                </div>
            </div>
        </div>
    );
};

