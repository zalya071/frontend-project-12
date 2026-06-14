import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';

import Header from '../components/Header.jsx';
import { getToken } from '../utils/auth.js';

const LoginPage = () => {
  const { t } = useTranslation();
  const token = getToken();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(false);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app">
      <Header />

      <div className="login-wrapper">
        <div className="login-card">
          <h1>{t('login.title')}</h1>

          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={async (values, { setSubmitting }) => {
              setAuthError(false);

              try {
                const response = await axios.post('/api/v1/login', values);

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', values.username);

                navigate('/');
              } catch {
                setAuthError(true);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="login-form">
                <div className="form-group">
                  <label htmlFor="username">{t('login.username')}</label>
                  <Field id="username" name="username" type="text" autoComplete="off" />
                </div>

                <div className="form-group">
                  <label htmlFor="password">{t('login.password')}</label>
                  <Field id="password" name="password" type="password" autoComplete="off" />
                </div>

                {authError && (
                  <div className="login-error">{t('login.error')}</div>
                )}

                <button type="submit" disabled={isSubmitting}>
                  {t('login.submit')}
                </button>

                <p className="test-user">{t('login.testUser')}</p>

                <p>
                  {t('login.noAccount')}
                  {' '}
                  <Link to="/signup">{t('login.signup')}</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
