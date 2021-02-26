import React, { useState } from 'react';
import './SignUp.css';

const SignUp = () => {
  return (
    <div className="signup-page">
      <div className="input-wrapper">
        <div className="signup-title-box">
          <h1>Sign up</h1>
        </div>
        <div className="firstName">email</div>
        <input type="text" className="inputFirst" placeholder="email" />
        <div className="lastName">pw</div>
        <input type="text" className="inputLast" placeholder="password" />
        <button className="signUpBttn">sign up</button>
      </div>
    </div>
  );
};
export default SignUp;
