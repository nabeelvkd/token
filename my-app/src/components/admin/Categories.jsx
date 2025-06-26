import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { Edit2 } from 'lucide-react';
import axios from 'axios';

const Categories = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: '', priority: 0, image: '' });
    const [categories, setCategories] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', image: '' });
    const navigate = useNavigate();

    // Slug generation function
    const slugify = (text) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/&/g, 'and')
            .replace(/[\s_]+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/admin/categories");
                setCategories(response.data.categories || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
                alert('Failed to fetch categories. Please try again.');
            }
        };

        fetchCategories();
    }, []);

    const handleEdit = (category) => {
        setEditingId(category._id);
        setEditData({
            name: category.name,
            priority: category.priority,
            image: category.image || ''
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({ name: '', priority: 0, image: '' });
    };

    const handleSave = async (category) => {
        if (!editData.name.trim()) {
            alert('Category name is required');
            return;
        }
        const updatedCategory = {
            ...category,
            name: editData.name,
            slug: slugify(editData.name), // Update slug when name changes
            priority: parseInt(editData.priority) || 0,
            image: editData.image || ''
        };
        try {
            await axios.post('http://localhost:5000/admin/updateacategory', updatedCategory);
            setCategories(categories.map(cat => cat._id === category._id ? updatedCategory : cat));
            setEditingId(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update category.');
            console.error('Error updating category:', error);
        }
    };

    const handleToggleActive = async (category) => {
        try {
            await axios.get(`http://localhost:5000/admin/toggleactive?id=${category._id}`);
            setCategories(categories.map(cat =>
                cat._id === category._id ? { ...cat, isActive: !cat.isActive } : cat
            ));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to toggle category status.');
            console.error('Error toggling category status:', error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.name.trim()) {
            alert('Category name is required');
            return;
        }
        const categoryToAdd = {
            name: newCategory.name,
            slug: slugify(newCategory.name),
            image: newCategory.image || ''
        };
        try {
            const response = await axios.post('http://localhost:5000/admin/addcategory', categoryToAdd);
            setCategories([...categories, response.data.category]);
            setNewCategory({ name: '', image: '' });
            setShowAddForm(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add category.');
            console.error('Error adding category:', error);
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <Header title="Categories" searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="container mx-auto px-4 py-10">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/90 border-b border-white/20">
                                <tr>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Image</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Category Name</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Slug</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Priority</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
                                    <th className="text-left px-6 py-4 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((category) => (
                                    <tr key={category._id} className="border-b border-white/10 hover:bg-white/90 transition-all duration-200">
                                        <td className="px-6 py-4">
                                            <img
                                                src={category.iconUrl || 'https://source.unsplash.com/100x100/?service'}
                                                alt={category.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.src = 'https://source.unsplash.com/100x100/?service';
                                                    console.log(`Failed to load image for category "${category.name}": ${category.image}`);
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingId === category._id ? (
                                                <input
                                                    type="text"
                                                    value={editData.name}
                                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                    placeholder="Enter category name"
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
                                                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                                                className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                            >
                                                {category.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingId === category._id ? (
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        value={editData.image}
                                                        onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                        placeholder="Enter image URL"
                                                    />
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleSave(category)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
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

                {/* Add Category Form */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add Category
                    </button>
                </div>
                {showAddForm && (
                    <div className="mt-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 max-w-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Category</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="Enter category name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={newCategory.image}
                                    onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    placeholder="Enter image URL (e.g., https://source.unsplash.com/...)"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleAddCategory}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setNewCategory({ name: '', image: '' });
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;