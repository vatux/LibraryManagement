import { useState } from 'react';
import Books from './redux/pages/Books';
import Users from './redux/pages/Users';
import Header from './redux/components/Header';
import Sidebar from './redux/components/Sidebar';
import Footer from './redux/components/Footer';
import Layout from './redux/components/Layout';
import Public from './redux/components/Public';
import Login from './redux/pages/Login';
import Welcome from './redux/features/Welcome';
import RequireAuth from './redux/features/RequireAuth';
import Home from './redux/pages/Home';
import { Routes, Route } from 'react-router-dom';
import UserLayout from './redux/components/UserLayout';
import authPersist from './redux/services/authPersist';
import BooksCopies from './redux/pages/BooksCopies';
import Authors from './redux/pages/Authors';
import Loans from './redux/pages/Loans';

function App() {

  authPersist();

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        {/* public routes */}
        <Route index element={<Public/>}/>
        <Route path='/login' element={<Login/>}/>

        {/* protected routes */}
        <Route element={<RequireAuth/>}>
          <Route path='/' element={<UserLayout/>}>
            <Route path='home' element={<Home/>}/>
            <Route path='welcome' element={<Welcome/>}/>
            <Route path='books' element={<Books/>}/>
            <Route path='users' element={<Users/>}/>
            <Route path='bookscopies' element={<BooksCopies/>}/>
            <Route path='authors' element={<Authors/>}/>
            <Route path='loans' element={<Loans/>}/>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
