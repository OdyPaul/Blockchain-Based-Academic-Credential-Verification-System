import React from "react";

function CreateVCConfirmModal({ show, count, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Verifiable Credentials</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            Are you sure you want to issue VC for {count} selected student
            {count > 1 ? "s" : ""}?
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-success" onClick={onConfirm}>
              Create VC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateVCConfirmModal;
