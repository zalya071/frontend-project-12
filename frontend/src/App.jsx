import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useState } from 'react';

const getToken = () => localStorage.getItem('token');

const HomePage = () => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <h1>Hexlet Chat</h1>
      <p>Вы авторизованы. Здесь позже будет чат.</p>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(false);

  return (
    <div>
      <h1>Войти</h1>

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
            navigate('/');
          } catch (error) {
            setAuthError(true);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="username">Ваш ник</label>
              <Field
                id="username"
                name="username"
                type="text"
                placeholder="Ваш ник"
              />
            </div>

            <div>
              <label htmlFor="password">Пароль</label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Пароль"
              />
            </div>

            {authError && (
              <div style={{ color: 'red' }}>
                Неверные имя пользователя или пароль
              </div>
            )}

            <button type="submit" disabled={isSubmitting}>
              Войти
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const NotFoundPage = () => (
  <div>
    <h1>404</h1>
    <p>Страница не найдена</p>
    <Link to="/">На главную</Link>
  </div>
);

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
