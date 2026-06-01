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
        cancel: 'Отменить',
        submit: 'Отправить',
        remove: 'Удалить',
        removeConfirm: 'Уверены, что хотите удалить канал # {{name}}?',
      },

      errors: {
        required: 'Обязательное поле',
        channelLength: 'От 3 до 20 символов',
        usernameLength: 'От 3 до 20 символов',
        passwordLength: 'Не менее 6 символов',
        passwordsMustMatch: 'Пароли должны совпадать',
        channelExists: 'Такой канал уже существует',
        messageSendFailed: 'Сообщение не отправилось. Проверь интернет.',
        addChannelFailed: 'Не удалось добавить канал',
        renameChannelFailed: 'Не удалось переименовать канал',
        removeChannelFailed: 'Не удалось удалить канал',
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