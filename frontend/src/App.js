import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './style/app.css';
import CreateAccount from './features/components/pages/createAccount';
import LoginPage from './features/components/pages/loginPage';
import MainPage from './features/components/pages/mainPage';
import UserInfo from './features/components/users/userInfo';
import MemeInfo from './features/components/memes/memeInfo';
import Navbar from './features/components/pages/navbar';
import Favorite from './features/components/pages/favorite';
import WrongAddress from './features/components/pages/wrongAddress';
import Ranking from './features/components/pages/ranking';
import AdminPanel from './features/components/pages/adminPanel';
import Spam from './features/components/pages/spam';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <div>
            <Navbar />
            <MainPage /> 
          </div>
        }/>
        <Route path='/admin' element={
          <div>
            <Navbar />
            <AdminPanel /> 
          </div>
        }/>
        <Route path='/favorite' element={
          <div>
            <Navbar />
            <Favorite /> 
          </div>
        }/>
        <Route path='/ranking' element={
          <div>
            <Navbar />
            <Ranking />
          </div>
        } />
        <Route path='/login' element={
          <LoginPage/>
        }/>
        <Route path='/createAccount' element={
          <CreateAccount/>
        }/>
        <Route path='/user/:uid' element={
          <div>
            <Navbar />
            <UserInfo />
          </div>
        } />
        <Route path='/meme/:id' element={
          <div>
            <Navbar />
            <MemeInfo />
          </div>
        } />
        <Route path='/spam' element={
          <div>
            <Navbar />
            <Spam />
          </div>
        } />
        <Route path="*" element={
          <div>
            <Navbar />
            <WrongAddress />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
