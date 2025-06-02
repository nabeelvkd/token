import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Admin from './pages/admin/Admin';
import Home from './pages/user/Home';
import Register from './pages/business/Register'

const App = () => {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path='/business/register' element={<Register />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;