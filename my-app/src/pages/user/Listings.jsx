import React, { useState, useEffect } from 'react';
import Navbar from '../../components/user/HomeNavbar';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Card from '../../components/user/Card';
import { useNavigate } from 'react-router-dom';

function Listings() {
  const location = useLocation();
  const [businesses, setBusinesses] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const parts = location.pathname.split('/');
    const id = parts[parts.length - 1];
    axios.get(`http://localhost:5000/listing/${id}`)
      .then((response) => {
        setBusinesses(response.data.businesses || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [location.pathname]);

  const handleSelect = (business) => {
    navigate(`${business._id}`)
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {businesses.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {businesses.map((b) => (
              <Card
                key={b._id}
                category={b.name}
                onSelect={() => handleSelect(b)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg py-10">No businesses available</p>
        )}
      </div>
    </div>
  );
}

export default Listings;
