import * as Yup from 'yup';

export const makeChannelSchema = (channels, t, currentName = '') => Yup.object({
  name: Yup.string()
    .trim()
    .min(3, t('errors.channelLength'))
    .max(20, t('errors.channelLength'))
    .notOneOf(
      channels
        .map((channel) => channel.name)
        .filter((name) => name !== currentName),
      t('errors.channelExists'),
    )
    .required(t('errors.required')),
});

export const makeSignupSchema = (t) => Yup.object({
  username: Yup.string()
    .min(3, t('errors.usernameLength'))
    .max(20, t('errors.usernameLength'))
    .required(t('errors.required')),
  password: Yup.string()
    .min(6, t('errors.passwordLength'))
    .required(t('errors.required')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], t('errors.passwordsMustMatch'))
    .required(t('errors.required')),
});
