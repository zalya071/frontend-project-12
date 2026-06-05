import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';

const ChannelForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  inputRef,
  onCancel,
  cancelText,
  submitText,
}) => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="modal-form">
          <label htmlFor="channel-name">
            {t('modals.channelName')}
          </label>

          <Field
            id="channel-name"
            innerRef={inputRef}
            name="name"
            className="modal-input"
            disabled={isSubmitting}
          />

          <ErrorMessage
            name="name"
            component="div"
            className="modal-error"
          />

          <div className="modal-buttons">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelText}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
            >
              {submitText}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ChannelForm;
