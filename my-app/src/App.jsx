import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Admin from './pages/admin/Admin';
import Home from './pages/user/Home';
import Register from './pages/business/Register'
import Business from './pages/business/Business'
import Login from './pages/business/Login'

const App = () => {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path='/business/register' element={<Register />} />
                <Route path='/business/*' element={<Business />} />
                <Route path='/business/login' element={<Login />} />

            </Routes>
        </BrowserRouter>
    );
};

export default App;