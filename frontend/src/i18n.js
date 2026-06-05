import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      appName: 'Hexlet Chat',
      logout: 'Выйти',

      loading: 'Загрузка...',
      loadingError: 'Ошибка загрузки данных',

      channels: 'Каналы',
      messagesCount: 'сообщений: {{count}}',
      messagePlaceholder: 'Введите сообщение...',
      newMessage: 'Новое сообщение',
      send: 'Отправить',

      login: {
        title: 'Вход',
        username: 'Ваш ник',
        password: 'Пароль',
        submit: 'Войти',
        error: 'Неверные имя пользователя или пароль',
        testUser: 'Тестовый пользователь: admin / admin',
        noAccount: 'Нет аккаунта?',
        signup: 'Регистрация',
      },

      signup: {
        title: 'Регистрация',
        username: 'Имя пользователя',
        password: 'Пароль',
        confirmPassword: 'Подтвердите пароль',
        submit: 'Зарегистрироваться',
        hasAccount: 'Уже есть аккаунт?',
        login: 'Войти',
        userExists: 'Такой пользователь уже существует',
        error: 'Ошибка регистрации',
      },

      modals: {
        addChannel: 'Добавить канал',
        renameChannel: 'Переименовать канал',
        removeChannel: 'Удалить канал',
        channelName: 'Имя канала',
        channelManagement: 'Управление каналом',
        cancel: 'Отменить',
        submit: 'Отправить',
        remove: 'Удалить',
        rename: 'Переименовать',
        removeConfirm: 'Уверены, что хотите удалить канал # {{name}}?',
      },

      errors: {
        required: 'Обязательное поле',
        channelLength: 'От 3 до 20 символов',
        usernameLength: 'От 3 до 20 символов',
        passwordLength: 'Не менее 6 символов',
        passwordsMustMatch: 'Пароли должны совпадать',
        channelExists: 'Такой канал уже существует',
      },

      toast: {
        networkError: 'Ошибка соединения',
        loadingError: 'Ошибка загрузки данных',
        channelCreated: 'Канал создан',
        channelRenamed: 'Канал переименован',
        channelRemoved: 'Канал удалён',
      },

      notFound: {
        title: '404',
        text: 'Страница не найдена',
        link: 'На главную',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
