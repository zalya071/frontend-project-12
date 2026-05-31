import { Link } from 'react-router-dom';

import Header from '../components/Header.jsx';

const NotFoundPage = () => (
  <div className="app">
    <Header />

    <div className="status">
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/">На главную</Link>
    </div>
  </div>
);

export default NotFoundPage;
