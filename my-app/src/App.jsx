import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import Admin from './pages/admin/Admin';
import Home from './pages/user/Home';
import Register from './pages/business/Register';
import Business from './pages/business/Business';
import Login from './pages/business/Login';
import MemberDashboard from './pages/business/Member';
import Listings from './pages/user/Listings';
import BusinessProfile from './pages/user/businessProfile';

const App = () => {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <Routes>
                    <Route path="/view" element={<Home />} />
                    <Route path="/admin/*" element={<Admin />} />
                    <Route path='/business/register' element={<Register />} />
                    <Route path='/business/*' element={<Business />} />
                    <Route path='/member' element={<MemberDashboard />} />
                    <Route path='/business/login' element={<Login />} />
                    <Route path='/view/:category' element={<Listings />} />
                    <Route path='/view/:category/:business' element={<BusinessProfile />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    );
};

export default App;