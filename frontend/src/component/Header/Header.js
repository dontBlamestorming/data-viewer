import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Header.css';
import Button from '@material-ui/core/Button';

const Header = () => {
  const [user, setUser] = useState('');
  const Token = localStorage.getItem('usertoken');

  const logout = () => {
    localStorage.clear();
  };
  return (
    <div className="Header">
      <div className="Wrap">
        <div className="LoginBttn">
          {!Token ? (
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
  );
};

export default Header;
