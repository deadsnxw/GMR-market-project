import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ProductInfo from './components/ProductInfo';
import UserContext from './context/UserContext';
import UserProfile from './components/Profile/UserProfile';
import { PrivateUserRoot } from './components/PrivateRoute';
import MainPage from "./components/MainPage";
import HeaderComponent from "./components/HeaderComponent";
import Balance from "./components/Balance";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetch("/user.json")
    .then((response) => response.json())
    .then((data) => {
      setUser(data);
      setLoading(false);
    });
  },[])


  if(loading) return <div>Loading...</div>

  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser}}>
        <Router>
          <HeaderComponent></HeaderComponent>
          <Routes>
            <Route path='/' element={<MainPage></MainPage>}></Route>
            <Route path='/product/:productId' element={<ProductInfo></ProductInfo>}></Route>
            <Route path='/me' element={<PrivateUserRoot component={<UserProfile></UserProfile>}></PrivateUserRoot>}></Route>
            <Route path='/product/:productId/edit' element={<div></div>}></Route>
            <Route path='/login' element={<div></div>}></Route>
            <Route path='/balance' element={<Balance></Balance>}></Route>
          </Routes>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
