import axios from "axios";
import React, { useEffect, useState } from "react";
import PinMap from "../../components/business/PinMap"

function BusinessInfo({ formData, setFormData, locationStatus, setLocationStatus }) {
    const [categories, setCategories] = useState([]);
    const [allSubCategories, setAllSubCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [latitude,setLatitude]=useState(null)
    const [longitude,setLongitude]=useState(null)


    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryRes = await axios.get("http://localhost:5000/admin/categories");
                const cat = categoryRes.data.categories.map(item => item.name);
                setCategories(cat);

                const subRes = await axios.get("http://localhost:5000/admin/subcategories");
                const sub = subRes.data;
                setAllSubCategories(sub);
            } catch (err) {
                console.error("Fetch error", err);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filteredSubs = allSubCategories
            .filter(item => item.category.name === formData.category)
            .map(item => item.name);

        setSubCategories(filteredSubs);
    }, [formData.category, allSubCategories]);

    return (
        <div className="flex-1 p-8 md:p-12">
            <div className="grid md:grid-cols-2">
                <div className="md:mt-7">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Info</h1>
                    <p className="text-gray-500 mb-8">
                        Please provide your name, phone number and create a password.
                    </p>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Category
                        </label>
                        <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mt-3 font-medium mb-2">
                            Sub Category
                        </label>
                        <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            onChange={(e) => handleInputChange('subCategory', e.target.value)}
                            value={formData.subCategory}
                        >
                            <option value="">Select Sub Category</option>
                            {subCategories.map((cat, idx) => (
                                <option key={idx} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mt-3 font-medium mb-2">
                            Address
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            placeholder="Enter full address (street, city, state, ZIP)"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm resize-y"
                            rows="4"
                        />
                    </div>
                </div>


                <div className="md:ml-20 md:mt-1 sm:mt-5">
                    <PinMap setFormData={setFormData}/>
                </div>
            </div>
        </div>
    );
}

export default BusinessInfo;