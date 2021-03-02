import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';
import Button from '@material-ui/core/Button';

const Header = () => {
  return (
    <div className="Header">
      <div className="Wrap">
        <div className="LoginBttn">
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" color="primary">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
