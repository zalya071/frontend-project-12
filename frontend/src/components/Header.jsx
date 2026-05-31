import { Link, useNavigate } from 'react-router-dom';

const Header = ({ showLogout = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        Hexlet Chat
      </Link>

      {showLogout && (
        <button type="button" className="logout-button" onClick={handleLogout}>
          Выйти
        </button>
      )}
    </header>
  );
};

export default Header;
