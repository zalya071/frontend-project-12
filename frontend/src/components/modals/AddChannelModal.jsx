import { useTranslation } from 'react-i18next';

import Modal from '../Modal.jsx';
import ChannelForm from '../ChannelForm.jsx';

const AddChannelModal = ({
  channels,
  makeChannelSchema,
  onSubmit,
  inputRef,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Modal title={t('modals.addChannel')} onClose={onClose}>
      <ChannelForm
        initialValues={{ name: '' }}
        validationSchema={makeChannelSchema(channels, t)}
        onSubmit={onSubmit}
        inputRef={inputRef}
        onCancel={onClose}
        cancelText={t('modals.cancel')}
        submitText={t('modals.submit')}
      />
    </Modal>
  );
};

export default AddChannelModal;
