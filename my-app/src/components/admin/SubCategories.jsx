import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubCategories = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: '', category: '', priority: 0 });
    const [newSubCategory, setNewSubCategory] = useState({ name: '', category: '', priority: 0 });
    const [showAddForm, setShowAddForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const subs = await axios.get('http://localhost:5000/admin/subcategories');
            const cats = await axios.get('http://localhost:5000/admin/categories');
            setSubCategories(subs.data);
            setCategories(cats.data.categories);
        };
        fetchData();
    }, []);

    const handleEdit = (sub) => {
        setEditingId(sub._id);
        setEditData({ name: sub.name, category: sub.category._id, priority: sub.priority });
    };

    const handleSave = (sub) => {
        axios.post('http://localhost:5000/admin/update-subcategory', {
            _id: sub._id,
            ...editData
        }).then(() => navigate(0)).catch(err => alert(err));
        setEditingId(null);
    };

    const handleToggleActive = (sub) => {
        axios.get(`http://localhost:5000/admin/toggle-subcategory?id=${sub._id}`)
            .then(() => navigate(0)).catch(err => alert(err));
    };

    const handleAdd = () => {
        if (!newSubCategory.name || !newSubCategory.category) {
            alert("All fields are required");
            return;
        }
        axios.post('http://localhost:5000/admin/addsubcategory', newSubCategory)
            .then(() => navigate(0)).catch(err => alert(err));
    };

    const filtered = subCategories.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Header title="Subcategories" searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 font-semibold text-gray-700">Name</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-700">Category</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-700">Priority</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
                                <th className="text-left px-6 py-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((sub) => (
                                <tr key={sub._id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {editingId === sub._id ? (
                                            <input value={editData.name}
                                                onChange={e => setEditData({ ...editData, name: e.target.value })}
                                                className="w-full border px-2 py-1" />
                                        ) : (
                                            sub.name
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === sub._id ? (
                                            <select value={editData.category}
                                                onChange={e => setEditData({ ...editData, category: e.target.value })}
                                                className="w-full border px-2 py-1">
                                                {categories.map(c => (
                                                    <option key={c._id} value={c._id}>{c.name}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            sub.category?.name || 'N/A'
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === sub._id ? (
                                            <input type="number" value={editData.priority}
                                                onChange={e => setEditData({ ...editData, priority: +e.target.value })}
                                                className="w-full border px-2 py-1" />
                                        ) : (
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                {sub.priority}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            onClick={() => handleToggleActive(sub)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${sub.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                            {sub.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === sub._id ? (
                                            <>
                                                <button onClick={() => handleSave(sub)} className="px-3 py-1 bg-green-500 text-white rounded-md mr-2">Save</button>
                                                <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md">Cancel</button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleEdit(sub)} className="text-blue-600 hover:text-blue-800">
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
            <div className="mt-4">
                <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md">Add Subcategory</button>
                {showAddForm && (
                    <div className="mt-4 bg-white p-4 rounded shadow border max-w-md">
                        <input type="text" placeholder="Name"
                            value={newSubCategory.name}
                            onChange={e => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
                            className="w-full mb-2 px-3 py-2 border rounded" />
                        <select
                            value={newSubCategory.category}
                            onChange={e => setNewSubCategory({ ...newSubCategory, category: e.target.value })}
                            className="w-full mb-2 px-3 py-2 border rounded">
                            <option value="">Select Category</option>
                            {categories.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                        <input type="number" placeholder="Priority"
                            value={newSubCategory.priority}
                            onChange={e => setNewSubCategory({ ...newSubCategory, priority: +e.target.value })}
                            className="w-full mb-3 px-3 py-2 border rounded" />
                        <div className="flex space-x-2">
                            <button onClick={handleAdd} className="px-4 py-2 bg-green-500 text-white rounded">Add</button>
                            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SubCategories;
