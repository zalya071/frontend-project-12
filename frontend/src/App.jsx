import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { setChatData } from './store.js';

const getToken = () => localStorage.getItem('token');

const HomePage = () => {
  const token = getToken();
  const dispatch = useDispatch();

  const { channels, messages, currentChannelId } = useSelector((state) => state.chat);

  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchChatData = async () => {
      try {
        const [channelsResponse, messagesResponse] = await Promise.all([
          axios.get('/api/v1/channels', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('/api/v1/messages', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        dispatch(setChatData({
          channels: channelsResponse.data,
          messages: messagesResponse.data,
          currentChannelId: channelsResponse.data[0]?.id ?? null,
        }));
      } catch (error) {
        console.error(error);
        setLoadingError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [token, dispatch]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (loadingError) {
    return <div>Ошибка загрузки данных</div>;
  }

  const currentMessages = (messages ?? []).filter(
    (message) => message.channelId === currentChannelId,
  );

  return (
    <div>
      <h1>Hexlet Chat</h1>

      <div style={{ display: 'flex', gap: '40px' }}>
        <aside>
          <h2>Каналы</h2>

          <ul>
            {(channels ?? []).map((channel) => (
              <li key={channel.id}>
                #{channel.name}
              </li>
            ))}
          </ul>
        </aside>

        <main>
          <h2>Чат</h2>

          <div>
            {currentMessages.map((message) => (
              <div key={message.id}>
                <b>{message.username}</b>
                {': '}
                {message.body}
              </div>
            ))}
          </div>

          <form>
            <input type="text" placeholder="Введите сообщение..." />
            <button type="submit">Отправить</button>
          </form>
        </main>
      </div>
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
