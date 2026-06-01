import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = ({ showLogout = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        {t('appName')}
      </Link>

      {showLogout && (
        <button type="button" className="logout-button" onClick={handleLogout}>
          {t('logout')}
        </button>
      )}
    </header>
  );
};

export default Header;
