import { useTranslation } from 'react-i18next';

const MessageForm = ({
  messageText,
  setMessageText,
  sending,
  onSubmit,
  inputRef,
}) => {
  const { t } = useTranslation();

  return (
    <form className="message-form" onSubmit={onSubmit}>
      <input
        ref={inputRef}
        aria-label={t('newMessage')}
        name="body"
        type="text"
        placeholder={t('messagePlaceholder')}
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        disabled={sending}
        autoComplete="off"
      />

      <button
        type="submit"
        aria-label={t('send')}
        disabled={sending || !messageText.trim()}
      >
        {t('send')}
      </button>
    </form>
  );
};

export default MessageForm;
