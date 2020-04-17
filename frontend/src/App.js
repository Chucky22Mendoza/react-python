import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Navigation } from './components/Navigation';
import { About } from './components/About';
import { User } from './components/User';


function App() {
  return (
    <Router>
      <Navigation/>
      <div className="container p-5">
        <Switch>
          <Route path="/about" component={About} />
          <Route path="/" component={User} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
