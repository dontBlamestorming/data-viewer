import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../Image/logo.png';

import './Header.css';
import Button from '@material-ui/core/Button';

const Header = () => {
  const [user, setUser] = useState('');

  const [token, setToken] = useState(localStorage.getItem('usertoken'));
  const logout = () => {
    localStorage.clear();
    setToken(false);
  };
  return (
    <div className="Header">
      <div className="Wrap">
        <Link to="/main">
          <img className="Logo" alt="logo" src={Logo} />
        </Link>
        <div className="HeaderRight">
          <p>사용자</p>
          <div className="LoginBttn">
            {!token ? (
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" color="primary">
                  Login
                </Button>
              </Link>
            ) : (
              <Link
                to="/login"
                style={{ textDecoration: 'none' }}
                onClick={logout}
              >
                <Button variant="outlined" color="primary">
                  Logout
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
