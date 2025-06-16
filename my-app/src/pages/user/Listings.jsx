import React, { useState, useEffect } from 'react';
import Navbar from '../../components/user/Navbar';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Card from '../../components/user/Card';

function Listings() {
  const location = useLocation();
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000${location.pathname}`)
      .then((response) => {
        setBusinesses(response.data.businesses || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [location.pathname]);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {businesses.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {businesses.map((b, index) => (
              <Card key={index} category={b.name} />
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
