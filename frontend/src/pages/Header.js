import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

import Button from '@material-ui/core/Button';
import '../styles/Header.css';

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
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" color="primary">
                  Login
                </Button>
              </Link>
            ) : (
              <Link to="/" style={{ textDecoration: 'none' }} onClick={logout}>
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
