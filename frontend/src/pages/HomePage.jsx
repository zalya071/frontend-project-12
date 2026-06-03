import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../components/Header.jsx';
import Modal from '../components/Modal.jsx';
import ChannelForm from '../components/ChannelForm.jsx';
import { getToken } from '../utils/auth.js';
import { makeChannelSchema } from '../utils/validation.js';
import { clean } from '../utils/profanity.js';

import {
  setChatData,
  addMessage,
  setCurrentChannelId,
  addChannel,
  removeChannel,
  renameChannel,
} from '../store.js';

const HomePage = () => {
  const { t } = useTranslation();
  const token = getToken();
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
  const [removing, setRemoving] = useState(false);

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
        toast.error(t('toast.loadingError'));
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [token, dispatch, t]);

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

  const closeModal = () => {
    setModal(null);
    setSelectedChannel(null);
    setRemoving(false);
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
          body: clean(body),
          channelId: currentChannelId,
          username,
        },
        authHeaders,
      );

      setMessageText('');
    } catch (error) {
      console.error(error);
      toast.error(t('toast.networkError'));
    } finally {
      setSending(false);
    }
  };

  const handleAddChannel = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        '/api/v1/channels',
        { name: clean(values.name.trim()) },
        authHeaders,
      );

      dispatch(setCurrentChannelId(response.data.id));
      toast.success(t('toast.channelCreated'));
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(t('toast.networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRenameChannel = async (values, { setSubmitting }) => {
    try {
      await axios.patch(
        `/api/v1/channels/${selectedChannel.id}`,
        { name: clean(values.name.trim()) },
        authHeaders,
      );

      toast.success(t('toast.channelRenamed'));
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(t('toast.networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveChannel = async () => {
    setRemoving(true);

    try {
      await axios.delete(
        `/api/v1/channels/${selectedChannel.id}`,
        authHeaders,
      );

      toast.success(t('toast.channelRemoved'));
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(t('toast.networkError'));
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="app">
      <Header showLogout />

      <div className="main-wrapper">
        {loading && <div className="status">{t('loading')}</div>}
        {loadingError && <div className="status">{t('loadingError')}</div>}

        {!loading && !loadingError && (
          <div className="chat-container">
            <aside className="channels-sidebar">
              <div className="channels-title">
                <b>{t('channels')}</b>
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
                              {t('modals.remove')}
                            </button>
                            <button type="button" onClick={() => openRenameModal(channel)}>
                              {t('modals.renameChannel')}
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
                <p>{t('messagesCount', { count: currentMessages.length })}</p>
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
                  placeholder={t('messagePlaceholder')}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !messageText.trim()}>
                  {t('send')}
                </button>
              </form>
            </main>
          </div>
        )}
      </div>

      {modal === 'add' && (
        <Modal title={t('modals.addChannel')} onClose={closeModal}>
          <ChannelForm
            initialValues={{ name: '' }}
            validationSchema={makeChannelSchema(channels, t)}
            onSubmit={handleAddChannel}
            inputRef={inputRef}
            onCancel={closeModal}
            cancelText={t('modals.cancel')}
            submitText={t('modals.submit')}
          />
        </Modal>
      )}

      {modal === 'rename' && selectedChannel && (
        <Modal title={t('modals.renameChannel')} onClose={closeModal}>
          <ChannelForm
            initialValues={{ name: selectedChannel.name }}
            validationSchema={makeChannelSchema(
              channels,
              t,
              selectedChannel.name,
            )}
            onSubmit={handleRenameChannel}
            inputRef={inputRef}
            onCancel={closeModal}
            cancelText={t('modals.cancel')}
            submitText={t('modals.submit')}
          />
        </Modal>
      )}

      {modal === 'remove' && selectedChannel && (
        <Modal title={t('modals.removeChannel')} onClose={closeModal}>
          <div className="modal-form">
            <p>{t('modals.removeConfirm', { name: selectedChannel.name })}</p>

            <div className="modal-buttons">
              <button type="button" onClick={closeModal} disabled={removing}>
                {t('modals.cancel')}
              </button>
              <button
                type="button"
                className="danger-button"
                disabled={removing}
                onClick={handleRemoveChannel}
              >
                {t('modals.remove')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HomePage;
