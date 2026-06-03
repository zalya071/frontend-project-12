import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider } from '@rollbar/react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './App.jsx';
import store from './store.js';
import i18n from './i18n.js';
import rollbar from './rollbar.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RollbarProvider instance={rollbar}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
            <ToastContainer />
          </BrowserRouter>
        </Provider>
      </I18nextProvider>
    </RollbarProvider>
  </React.StrictMode>,
);
