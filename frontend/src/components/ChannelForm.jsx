import { Formik, Form, Field, ErrorMessage } from 'formik';

const ChannelForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  inputRef,
  onCancel,
  cancelText,
  submitText,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({ isSubmitting }) => (
      <Form className="modal-form">
        <Field
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

export default ChannelForm;
