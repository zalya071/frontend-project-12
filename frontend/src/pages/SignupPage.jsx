import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';

import Header from '../components/Header.jsx';
import { getToken } from '../utils/auth.js';
import { signupSchema } from '../utils/validation.js';

const SignupPage = () => {
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
          <h1>Регистрация</h1>

          <Formik
            initialValues={{
              username: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={signupSchema}
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
                  alert('Ошибка регистрации');
                }
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="login-form">
                <div className="form-group">
                  <label htmlFor="username">Имя пользователя</label>
                  <Field id="username" name="username" type="text" />
                  <ErrorMessage name="username" component="div" className="login-error" />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Пароль</label>
                  <Field id="password" name="password" type="password" />
                  <ErrorMessage name="password" component="div" className="login-error" />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Подтвердите пароль</label>
                  <Field id="confirmPassword" name="confirmPassword" type="password" />
                  <ErrorMessage name="confirmPassword" component="div" className="login-error" />
                </div>

                {signupError && (
                  <div className="login-error">
                    Такой пользователь уже существует
                  </div>
                )}

                <button type="submit" disabled={isSubmitting}>
                  Зарегистрироваться
                </button>

                <p>
                  Уже есть аккаунт?
                  {' '}
                  <Link to="/login">Войти</Link>
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
