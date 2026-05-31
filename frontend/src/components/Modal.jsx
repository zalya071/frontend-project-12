const Modal = ({ title, children, onClose }) => (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <h2>{title}</h2>
        <button type="button" onClick={onClose}>×</button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
