import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

import Button from '@material-ui/core/Button';
import '../styles/Header.css';

const Header = () => {
  const [token, setToken] = useState(localStorage.getItem('usertoken'));
  const logout = () => {
    localStorage.clear();
    setToken(false);
  };

  return (
    <header id="header">
      <div className="container">
        {/* header */}
        <div className="header">
          <h1>
            <Link>
              <img alt="logo" src={Logo} />
            </Link>
          </h1>

          {/* Nav */}
          <div className="nav">
            <ul className="clearfix">
              <li>
                <Link to="/" className="btn">
                  MENU1
                </Link>
              </li>
              <li>
                <Link to="/" className="btn">
                  MENU2
                </Link>
              </li>
              <li>
                <Link to="/" className="btn">
                  MENU3
                </Link>
              </li>
              <li>
                <Link to="/" className="btn">
                  MENU4
                </Link>
              </li>
              <li>
                {!token ? (
                  <Link
                    to="/"
                    className="btn"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="outlined" color="primary">
                      Login
                    </Button>
                  </Link>
                ) : (
                  <Link
                    to="/"
                    style={{ textDecoration: 'none' }}
                    onClick={logout}
                    className="btn"
                  >
                    <Button variant="outlined" color="primary">
                      Logout
                    </Button>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
