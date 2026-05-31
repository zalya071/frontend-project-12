import * as Yup from 'yup';

export const makeChannelSchema = (channels, currentName = '') => Yup.object({
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

export const signupSchema = Yup.object({
  username: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
    .required('Обязательное поле'),
});
