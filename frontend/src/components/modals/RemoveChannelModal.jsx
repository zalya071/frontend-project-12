import { useTranslation } from 'react-i18next';

import Modal from '../Modal.jsx';

const RemoveChannelModal = ({
  selectedChannel,
  removing,
  onRemove,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Modal title={t('modals.removeChannel')} onClose={onClose}>
      <div className="modal-form">
        <p>{t('modals.removeConfirm', { name: selectedChannel.name })}</p>

        <div className="modal-buttons">
          <button type="button" onClick={onClose} disabled={removing}>
            {t('modals.cancel')}
          </button>

          <button
            type="button"
            className="danger-button"
            disabled={removing}
            onClick={onRemove}
          >
            {t('modals.remove')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveChannelModal;
