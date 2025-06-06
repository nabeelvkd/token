
import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "../../components/business/Navbar";
import BusinessHome from "./BusinessHome";
import Services from "../../components/business/Services";

function Business() {

    const [services, setServices] = useState([]);
    const [serviceType, setServiceType] = useState({
        token: false,
        appointment: false,
    });

    return (
        <div>
            <Navbar />
            <Routes>
                {/* Redirect from /business to /business/home */}
                <Route path="/" element={<Navigate to="home" replace />} />
                <Route path="home" element={<BusinessHome />} />
                <Route path="services" element={<Services reg={false} services={services} setServices={setServices} serviceType={serviceType} setServiceType={setServiceType}/>} />
            </Routes>
        </div>
    );
}

export default Business;
