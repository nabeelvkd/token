
import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "../../components/business/Navbar";
import BusinessHome from "./BusinessHome";
import Services from "../../components/business/Services";
import Members from "../../components/business/Members"
import ManageTokens from "../../components/business/ManageTokens"

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
                <Route path='members' element={<Members />} />
                <Route path='tokens' element={<ManageTokens />} />
                <Route path="services" element={<Services reg={true} services={services} setServices={setServices} serviceType={serviceType} setServiceType={setServiceType} />} />
            </Routes>
        </div>
    );
}

export default Business;
