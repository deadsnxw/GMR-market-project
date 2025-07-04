import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ProductInfo from './components/ProductInfo';
import {UserProvider} from './context/UserContext';
import UserProfile from './components/Profile/UserProfile';
import {PrivateGuestRoot, PrivateUserRoot, PrivateLoggedRoot, PrivateShopRoot, PrivateShopCreatedRoot} from './components/PrivateRoute';
import MainPage from "./components/MainPage";
import HeaderComponent from "./components/HeaderComponent";
import Balance from "./components/Balance";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateEditProduct from './components/CreateEditProduct/CreateEditProduct';
import NotFound from './components/NotFound';


function App() {
  return (
      <div className="App">
        <Router>
          <UserProvider>
            <HeaderComponent />
            <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/product/:productId' element={<ProductInfo />} />
              <Route path='/me' element={<PrivateLoggedRoot component={<UserProfile></UserProfile>}></PrivateLoggedRoot>}></Route>
              <Route path='/me/create' element={<PrivateShopRoot component={<CreateEditProduct></CreateEditProduct>}></PrivateShopRoot>}></Route>
              <Route path='/product/:productId/edit' element={<PrivateShopCreatedRoot component={<CreateEditProduct isEditing={true}></CreateEditProduct>}></PrivateShopCreatedRoot>}></Route>
              <Route path='/login' element={<PrivateGuestRoot component={<Login />} />} />
              <Route path='/balance' element={<PrivateUserRoot component={<Balance />} />} />
              <Route path='/register' element={<PrivateGuestRoot component={<Register />} />} />
              <Route path='*' element={<NotFound/>}/>
            </Routes>
          </UserProvider>
        </Router>
      </div>
  );
}

export default App;
