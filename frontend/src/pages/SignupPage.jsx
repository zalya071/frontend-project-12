import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';

import Header from '../components/Header.jsx';
import { getToken } from '../utils/auth.js';
import { makeSignupSchema } from '../utils/validation.js';

const SignupPage = () => {
  const { t } = useTranslation();
  const token = getToken();
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState(false);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app">
      <Header />

      <div className="login-wrapper">
        <div className="login-card">
          <h1>{t('signup.title')}</h1>

          <Formik
            initialValues={{
              username: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={makeSignupSchema(t)}
            onSubmit={async (values, { setSubmitting }) => {
              setSignupError(false);

              try {
                const response = await axios.post('/api/v1/signup', {
                  username: values.username,
                  password: values.password,
                });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', values.username);

                navigate('/');
              } catch (error) {
                if (error.response?.status === 409) {
                  setSignupError(true);
                } else {
                  alert(t('signup.error'));
                }
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="login-form">
                <div className="form-group">
                  <label htmlFor="username">{t('signup.username')}</label>
                  <Field id="username" name="username" type="text" autoComplete="off" />
                  <ErrorMessage name="username" component="div" className="login-error" />
                </div>

                <div className="form-group">
                  <label htmlFor="password">{t('signup.password')}</label>
                  <Field id="password" name="password" type="password" autoComplete="off" />
                  <ErrorMessage name="password" component="div" className="login-error" />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">{t('signup.confirmPassword')}</label>
                  <Field id="confirmPassword" name="confirmPassword" type="password" autoComplete="off" />
                  <ErrorMessage name="confirmPassword" component="div" className="login-error" />
                </div>

                {signupError && (
                  <div className="login-error">{t('signup.userExists')}</div>
                )}

                <button type="submit" disabled={isSubmitting}>
                  {t('signup.submit')}
                </button>

                <p>
                  {t('signup.hasAccount')}
                  {' '}
                  <Link to="/login">{t('signup.login')}</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;