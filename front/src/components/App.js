import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Video from './Video';
import Home from './Home';
import Navbar from './Navbar'

const App = () => (
  <Router>
    <Navbar />
    <Route exact path='/' component={Home} />
    <Route exact path='/home' component={Home} />
    <Route exact path='/video' component={Video} />
  </Router>
);

export default App;
