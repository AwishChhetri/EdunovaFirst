import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard.js';
import Login from './pages/Login.js';
import Overview from './components/Overview.js'
import axios from 'axios'
// axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.baseURL = 'https://edunova-o17c.onrender.com';
const App = () => {
  return (
    <Router>
    

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/table" element={<Overview />} />
      </Routes>
    </Router>
  );
};

export default App;
