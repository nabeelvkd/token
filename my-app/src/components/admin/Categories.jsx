import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { Edit2 } from 'lucide-react';
import axios from 'axios'
import { useEffect } from 'react';

//const API_URL = process.env.REACT_APP_API_URL;

const Categories = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: '', priority: 0 });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/admin/categories");
                setCategories(response.data.categories)
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleEdit = (category) => {
        setEditingId(category._id);
        setEditData({
            name: category.name,
            priority: category.priority
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({ name: '', slug: '', priority: 0 });
    };

    const handleSave = (category) => {
        category.name=editData.name
        category.priority=editData.priority
        axios.post('http://localhost:5000/admin/updatacategory',category).then((response)=>{
            navigate(0)
        }).catch((error)=>{
            alert(error)
        })
        setEditingId(null);
    };

    const handleToggleActive = (category) => {
        axios.get(`http://localhost:5000/admin/toggleactive?id=${category._id}`)
            .then(response => {
                navigate(0);
            })
            .catch(error => {
                alert(error)
            });
        
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Header title="Categories" searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 font-semibold text-gray-700">Category Name</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-700">Slug</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-700">Priority</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((category) => (
                                <tr key={category._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {editingId === category._id ? (
                                            <input
                                                type="text"
                                                value={editData.name}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <span className="font-medium text-gray-900">{category.name}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-600">{category.slug}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === category._id ? (
                                            <input
                                                type="number"
                                                value={editData.priority}
                                                onChange={(e) => setEditData({ ...editData, priority: parseInt(e.target.value) })}
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                        ) : (
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {category.priority}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            onClick={() => handleToggleActive(category)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${category.isActive ? 'bg-green-600 text-green-100' : 'bg-red-600 text-white'
                                                }`}
                                        >
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === category._id ? (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleSave(category)}
                                                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="p-2 text-gray-500 hover:text-blue-600"
                                                aria-label={`Edit ${category.name}`}
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Categories;