import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Admin from './pages/admin/Admin';
import Home from './pages/user/Home';
import Register from './pages/business/Register'
import Business from './pages/business/Business'
import Login from './pages/business/Login'
import MemberDashboard from './pages/business/Member';
import Listings from './pages/user/Listings';

const App = () => {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path='/business/register' element={<Register />} />
                <Route path='/business/*' element={<Business />} />
                <Route path='/member' element={<MemberDashboard/>}/>
                <Route path='/business/login' element={<Login />} />
                <Route path='/*' element={<Listings/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default App;