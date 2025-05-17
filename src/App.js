import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ProductInfo from './components/ProductInfo';
import {UserProvider} from './context/UserContext';
import UserProfile from './components/Profile/UserProfile';
import {PrivateGuestRoot, PrivateUserRoot} from './components/PrivateRoute';
import MainPage from "./components/MainPage";
import HeaderComponent from "./components/HeaderComponent";
import Balance from "./components/Balance";
import Login from "./components/Login";
import Register from "./components/Register";


function App() {
  return (
      <div className="App">
        <Router>
          <UserProvider>
            <HeaderComponent />
            <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/product/:productId' element={<ProductInfo />} />
              <Route path='/me' element={<PrivateUserRoot component={<UserProfile />} />} />
              <Route path='/product/:productId/edit' element={<div />} />
              <Route path='/login' element={<PrivateGuestRoot component={<Login />} />} />
              <Route path='/balance' element={<PrivateUserRoot component={<Balance />} />} />
              <Route path='/register' element={<PrivateGuestRoot component={<Register />} />} />
            </Routes>
          </UserProvider>
        </Router>
      </div>
  );
}

export default App;
