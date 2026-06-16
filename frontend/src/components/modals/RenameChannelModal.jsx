import { useTranslation } from 'react-i18next';

import Modal from '../Modal.jsx';
import ChannelForm from '../ChannelForm.jsx';

const RenameChannelModal = ({
  channels,
  selectedChannel,
  makeChannelSchema,
  onSubmit,
  inputRef,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Modal title={t('modals.renameChannel')} onClose={onClose}>
      <ChannelForm
        initialValues={{ name: selectedChannel.name }}
        validationSchema={makeChannelSchema(channels, t, selectedChannel.name)}
        onSubmit={onSubmit}
        inputRef={inputRef}
        onCancel={onClose}
        cancelText={t('modals.cancel')}
        submitText={t('modals.submit')}
      />
    </Modal>
  );
};

export default RenameChannelModal;