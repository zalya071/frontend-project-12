import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';

import Header from '../components/Header.jsx';
import { getToken } from '../utils/auth.js';

const LoginPage = () => {
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
          <h1>Вход</h1>

          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            onSubmit={async (values, { setSubmitting }) => {
              setAuthError(false);

              try {
                const response = await axios.post('/api/v1/login', values);

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', values.username);

                navigate('/');
              } catch (error) {
                setAuthError(true);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="login-form">
                <div className="form-group">
                  <label htmlFor="username">Ваш ник</label>
                  <Field id="username" name="username" type="text" />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Пароль</label>
                  <Field id="password" name="password" type="password" />
                </div>

                {authError && (
                  <div className="login-error">
                    Неверные имя пользователя или пароль
                  </div>
                )}

                <button type="submit" disabled={isSubmitting}>
                  Войти
                </button>

                <p className="test-user">Тестовый пользователь: admin / admin</p>

                <p>
                  Нет аккаунта?
                  {' '}
                  <Link to="/signup">Регистрация</Link>
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
