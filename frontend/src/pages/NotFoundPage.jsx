import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from '../components/Header.jsx';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="app">
      <Header />

      <div className="status">
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.text')}</p>
        <Link to="/">{t('notFound.link')}</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
