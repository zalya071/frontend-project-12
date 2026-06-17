import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../components/Header.jsx';
import MessageForm from '../components/MessageForm.jsx';
import MessagesList from '../components/MessagesList.jsx';
import AddChannelModal from '../components/modals/AddChannelModal.jsx';
import RenameChannelModal from '../components/modals/RenameChannelModal.jsx';
import RemoveChannelModal from '../components/modals/RemoveChannelModal.jsx';
import { getToken } from '../utils/auth.js';
import { makeChannelSchema } from '../utils/validation.js';
import { clean } from '../utils/profanity.js';
import { getAuthApi } from '../api/api.js';

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
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  const username = localStorage.getItem('username') ?? 'admin';
  const authApi = getAuthApi(token);

  const currentMessages = messages.filter(
    (message) => message.channelId === currentChannelId,
  );

  const currentChannel = channels.find((channel) => channel.id === currentChannelId);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchChatData = async () => {
      try {
        const [channelsResponse, messagesResponse] = await Promise.all([
          authApi.get('/channels'),
          authApi.get('/messages'),
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length]);

  useEffect(() => {
    setMessageText('');
    messageInputRef.current?.focus();
  }, [currentChannelId]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const closeModal = () => {
    setModal(null);
    setSelectedChannel(null);
    setRemoving(false);
  };

  const handleChangeChannel = (channelId) => {
    dispatch(setCurrentChannelId(channelId));
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
      await authApi.post('/messages', {
        body: clean(body),
        channelId: currentChannelId,
        username,
      });

      setMessageText('');
      messageInputRef.current?.focus();
    } catch (error) {
      console.error(error);
      toast.error(t('toast.networkError'));
    } finally {
      setSending(false);
    }
  };

  const handleAddChannel = async (values, { setSubmitting }) => {
    try {
      const response = await authApi.post('/channels', {
        name: clean(values.name.trim()),
      });

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
      await authApi.patch(`/channels/${selectedChannel.id}`, {
        name: clean(values.name.trim()),
      });

      toast.success(t('toast.channelRenamed'));
      closeModal();
      messageInputRef.current?.focus();
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
      await authApi.delete(`/channels/${selectedChannel.id}`);

      toast.success(t('toast.channelRemoved'));
      closeModal();
      messageInputRef.current?.focus();
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
                  aria-label="+"
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
                      onClick={() => handleChangeChannel(channel.id)}
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
                          aria-label={t('modals.channelManagement')}
                          onClick={() => setOpenedMenuId(
                            openedMenuId === channel.id ? null : channel.id,
                          )}
                        >
                          <span aria-hidden="true">⋮</span>
                          <span className="visually-hidden">
                            {t('modals.channelManagement')}
                          </span>
                        </button>

                        {openedMenuId === channel.id && (
                          <div className="channel-dropdown">
                            <button
                              type="button"
                              onClick={() => openRenameModal(channel)}
                            >
                              {t('modals.rename')}
                            </button>

                            <button
                              type="button"
                              onClick={() => openRemoveModal(channel)}
                            >
                              {t('modals.remove')}
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

              <MessagesList
                messages={currentMessages}
                messagesEndRef={messagesEndRef}
              />

              <MessageForm
                messageText={messageText}
                setMessageText={setMessageText}
                sending={sending}
                onSubmit={handleSubmitMessage}
                inputRef={messageInputRef}
              />
            </main>
          </div>
        )}
      </div>

      {modal === 'add' && (
        <AddChannelModal
          channels={channels}
          makeChannelSchema={makeChannelSchema}
          onSubmit={handleAddChannel}
          inputRef={inputRef}
          onClose={closeModal}
        />
      )}

      {modal === 'rename' && selectedChannel && (
        <RenameChannelModal
          channels={channels}
          selectedChannel={selectedChannel}
          makeChannelSchema={makeChannelSchema}
          onSubmit={handleRenameChannel}
          inputRef={inputRef}
          onClose={closeModal}
        />
      )}

      {modal === 'remove' && selectedChannel && (
        <RemoveChannelModal
          selectedChannel={selectedChannel}
          removing={removing}
          onRemove={handleRemoveChannel}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default HomePage;
