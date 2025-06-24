import React, { useEffect, useState } from "react";
import Navbar from '../../components/user/HomeNavbar'
import Card from '../../components/user/Card';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([])
    const navigate=useNavigate()

    useEffect(() => {
        axios.get("http://localhost:5000/admin/categories").then((response) => {
            setCategories(response.data.categories)
        })
    }, [])

    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/&/g, 'and')               // Replace & with 'and'
            .replace(/[\s_]+/g, '-')            // Replace spaces and underscores with -
            .replace(/[^\w\-]+/g, '')           // Remove all non-word characters except -
            .replace(/\-\-+/g, '-')             // Replace multiple - with a single -
            .replace(/^-+|-+$/g, '');           // Trim hyphens from start and end
    }

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        category=slugify(category)
        navigate(`/view/${category}`)
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Select a Service Category</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            category={category.name}
                            isSelected={selectedCategory === category.name}
                            onSelect={handleSelectCategory}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}