import Rollbar from 'rollbar';

const accessToken = import.meta.env.VITE_ROLLBAR_TOKEN;

const rollbar = new Rollbar({
  accessToken: accessToken || 'empty',
  enabled: Boolean(accessToken),
  captureUncaught: Boolean(accessToken),
  captureUnhandledRejections: Boolean(accessToken),
  environment: import.meta.env.MODE,
});

export default rollbar;