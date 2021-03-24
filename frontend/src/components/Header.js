import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

import { Link as _Link, useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import '../styles/Header.css';

const Header = ({ user, history }) => {
  const onCickLogout = () => {
    // history.push('/');
    localStorage.removeItem('AUTH_TOKEN');
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
                {user ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    className="logout__btn"
                    onClick={onCickLogout}
                  >
                    Logout
                  </Button>
                ) : (
                  <Link
                    to="/"
                    style={{ textDecoration: 'none' }}
                    className="btn"
                  >
                    <Button variant="outlined" color="primary">
                      Login
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
