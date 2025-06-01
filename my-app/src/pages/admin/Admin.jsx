import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import UsersDashboard from '../../components/admin/UsersDashboard';
import Categories from '../../components/admin/Categories';
import SubCategories from '../../components/admin/SubCategories';

const AdminDashboard = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-hidden">
                <div className="p-6">
                    <Routes>
                        <Route path="/users" element={<UsersDashboard />} />
                        <Route path='/categories' element={<Categories />} />
                        <Route path='/subcategories' element={<SubCategories />} />
                        <Route path="/" element={<Navigate to="/admin/users" replace />} />
                        <Route path="*" element={<UsersDashboard />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;