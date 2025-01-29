import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import MainPage from './components/MainPage'
import Request from './components/Request'
import Navbar from './components/Navbar'

const App = () => {
  const isLoggedIn = localStorage.getItem('token');
  return (
    <BrowserRouter>
      {isLoggedIn ? <Navbar /> : null}
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/mainpage' element={<MainPage />} />
        <Route path='/request' element={<Request />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
