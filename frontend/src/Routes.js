import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import Header from './component/Header/Header';
import SignUp from './Pages/SignUp/SignUp';
import LogIn from './Pages/LogIn/LogIn';

const Routes = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/main" component={App} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/" component={LogIn} />
      </Switch>
    </Router>
  );
};

export default Routes;
