import { HashRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import LoginPage from './Pages/Login'
import Home from './Pages/Home'


export default () => {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </HashRouter>
    </div>
  )
}