import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home/Home';
import Navbar from './Navbar/Navbar';
import Lybrary from './Lybrary/Lybrary';
import Lybrary2 from './Lybrary2/Lybrary2';

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/books1' element={<Lybrary/>}/>
          <Route path='/books2' element={<Lybrary2/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

