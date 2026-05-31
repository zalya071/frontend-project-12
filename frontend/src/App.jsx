import { useEffect, useRef, useState } from 'react';
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { io } from 'socket.io-client';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import {
  setChatData,
  addMessage,
  setCurrentChannelId,
  addChannel,
  removeChannel,
  renameChannel,
} from './store.js';

const getToken = () => localStorage.getItem('token');

const makeChannelSchema = (channels, currentName = '') => Yup.object({
  name: Yup.string()
    .trim()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .notOneOf(
      channels
        .map((channel) => channel.name)
        .filter((name) => name !== currentName),
      'Такой канал уже существует',
    )
    .required('Обязательное поле'),
});

const Modal = ({ title, children, onClose }) => (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <h2>{title}</h2>
        <button type="button" onClick={onClose}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const HomePage = () => {
  const token = getToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    channels,
    messages,
    currentChannelId,
  } = useSelector((state) => state.chat);

  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [modal, setModal] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [openedMenuId, setOpenedMenuId] = useState(null);

  const inputRef = useRef(null);

  const username = localStorage.getItem('username') ?? 'admin';

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchChatData = async () => {
      try {
        const [channelsResponse, messagesResponse] = await Promise.all([
          axios.get('/api/v1/channels', authHeaders),
          axios.get('/api/v1/messages', authHeaders),
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

  useEffect(() => {
    const socket = io();

    socket.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });

    socket.on('newChannel', (channel) => {
      dispatch(addChannel(channel));
    });

    socket.on('removeChannel', ({ id }) => {
      dispatch(removeChannel(id));
    });

    socket.on('renameChannel', (channel) => {
      dispatch(renameChannel(channel));
    });

    return () => {
      socket.off('newMessage');
      socket.off('newChannel');
      socket.off('removeChannel');
      socket.off('renameChannel');
      socket.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    if (modal && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [modal]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const currentMessages = messages.filter(
    (message) => message.channelId === currentChannelId,
  );

  const currentChannel = channels.find((channel) => channel.id === currentChannelId);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const closeModal = () => {
    setModal(null);
    setSelectedChannel(null);
  };

  const openRenameModal = (channel) => {
    setSelectedChannel(channel);
    setOpenedMenuId(null);
    setModal('rename');
  };

  const openRemoveModal = (channel) => {
    setSelectedChannel(channel);
    setOpenedMenuId(null);
    setModal('remove');
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();

    const body = messageText.trim();

    if (!body) {
      return;
    }

    setSending(true);

    try {
      await axios.post(
        '/api/v1/messages',
        {
          body,
          channelId: currentChannelId,
          username,
        },
        authHeaders,
      );

      setMessageText('');
    } catch (error) {
      console.error(error);
      alert('Сообщение не отправилось. Проверь интернет.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-brand">Hexlet Chat</div>
        <button type="button" className="logout-button" onClick={handleLogout}>
          Выйти
        </button>
      </header>

      <div className="main-wrapper">
        {loading && <div className="status">Загрузка...</div>}
        {loadingError && <div className="status">Ошибка загрузки данных</div>}

        {!loading && !loadingError && (
          <div className="chat-container">
            <aside className="channels-sidebar">
              <div className="channels-title">
                <b>Каналы</b>
                <button
                  type="button"
                  className="add-channel-button"
                  onClick={() => setModal('add')}
                >
                  +
                </button>
              </div>

              <ul className="channels-list">
                {channels.map((channel) => (
                  <li key={channel.id} className="channel-item">
                    <button
                      type="button"
                      className={channel.id === currentChannelId ? 'channel-button active' : 'channel-button'}
                      onClick={() => dispatch(setCurrentChannelId(channel.id))}
                    >
                      #
                      {' '}
                      {channel.name}
                    </button>

                    {channel.removable && (
                      <div className="channel-menu">
                        <button
                          type="button"
                          className="channel-menu-button"
                          onClick={() => setOpenedMenuId(
                            openedMenuId === channel.id ? null : channel.id,
                          )}
                        >
                          ⋮
                        </button>

                        {openedMenuId === channel.id && (
                          <div className="channel-dropdown">
                            <button type="button" onClick={() => openRemoveModal(channel)}>
                              Удалить
                            </button>
                            <button type="button" onClick={() => openRenameModal(channel)}>
                              Переименовать
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </aside>

            <main className="chat-content">
              <div className="chat-header">
                <h2>
                  #
                  {' '}
                  {currentChannel?.name ?? 'general'}
                </h2>
                <p>
                  сообщений:
                  {' '}
                  {currentMessages.length}
                </p>
              </div>

              <div className="messages-list">
                {currentMessages.map((message) => (
                  <div key={message.id} className="message">
                    <b>{message.username}</b>
                    {': '}
                    <span>{message.body}</span>
                  </div>
                ))}
              </div>

              <form className="message-form" onSubmit={handleSubmitMessage}>
                <input
                  type="text"
                  placeholder="Введите сообщение..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !messageText.trim()}>
                  Отправить
                </button>
              </form>
            </main>
          </div>
        )}
      </div>

      {modal === 'add' && (
        <Modal title="Добавить канал" onClose={closeModal}>
          <Formik
            initialValues={{ name: '' }}
            validationSchema={makeChannelSchema(channels)}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const response = await axios.post(
                  '/api/v1/channels',
                  { name: values.name.trim() },
                  authHeaders,
                );

                dispatch(setCurrentChannelId(response.data.id));
                closeModal();
              } catch (error) {
                console.error(error);
                alert('Не удалось добавить канал');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="modal-form">
                <Field
                  innerRef={inputRef}
                  name="name"
                  className="modal-input"
                  disabled={isSubmitting}
                />
                <ErrorMessage name="name" component="div" className="modal-error" />

                <div className="modal-buttons">
                  <button type="button" onClick={closeModal} disabled={isSubmitting}>
                    Отменить
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    Отправить
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {modal === 'rename' && selectedChannel && (
        <Modal title="Переименовать канал" onClose={closeModal}>
          <Formik
            initialValues={{ name: selectedChannel.name }}
            validationSchema={makeChannelSchema(channels, selectedChannel.name)}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await axios.patch(
                  `/api/v1/channels/${selectedChannel.id}`,
                  { name: values.name.trim() },
                  authHeaders,
                );

                closeModal();
              } catch (error) {
                console.error(error);
                alert('Не удалось переименовать канал');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="modal-form">
                <Field
                  innerRef={inputRef}
                  name="name"
                  className="modal-input"
                  disabled={isSubmitting}
                />
                <ErrorMessage name="name" component="div" className="modal-error" />

                <div className="modal-buttons">
                  <button type="button" onClick={closeModal} disabled={isSubmitting}>
                    Отменить
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    Отправить
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {modal === 'remove' && selectedChannel && (
        <Modal title="Удалить канал" onClose={closeModal}>
          <div className="modal-form">
            <p>
              Уверены, что хотите удалить канал
              {' '}
              <b>
                #
                {' '}
                {selectedChannel.name}
              </b>
              ?
            </p>

            <div className="modal-buttons">
              <button type="button" onClick={closeModal}>
                Отменить
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={async () => {
                  try {
                    await axios.delete(
                      `/api/v1/channels/${selectedChannel.id}`,
                      authHeaders,
                    );

                    closeModal();
                  } catch (error) {
                    console.error(error);
                    alert('Не удалось удалить канал');
                  }
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(false);

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-brand">Hexlet Chat</div>
      </header>

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
                  <Link to="/login">Регистрация</Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
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
