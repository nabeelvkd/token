import { useState, useRef } from 'react';
import BasicInfo from '../../components/business/BasicInfo';
import BusinessInfo from '../../components/business/BusinessInfo';
import Services from '../../components/business/Services';
import WorkingHours from '../../components/business/WorkingHours';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];


export default function MultiStepForm() {
    const [active, setActive] = useState(1)
    const steps = [
        { number: 1, title: 'BASIC INFO', active: active === 1 },
        { number: 2, title: 'BUSINESS INFO', active: active == 2 },
        { number: 3, title: 'ADD SERVICES', active: active === 3 },
        { number: 4, title: 'WORKING HOURS', active: active == 4 }
    ];
    const buttonRef = useRef(null);
    const navigate=useNavigate()
    //Business Info
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        phone: '',
        category: '',
        subCategory: '',
        location: '',
        address: ''
    });

    const [locationStatus, setLocationStatus] = useState('');

    //Services
    const [services, setServices] = useState([]);
    const [serviceType, setServiceType] = useState({
        token: false,
        appointment: false,
    });

    //Working Hours
    const [workingHours, setWorkingHours] = useState(
        daysOfWeek.reduce((acc, day) => {
            acc[day] = {
                enabled: false,
                intervals: []
            };
            return acc;
        }, {})
    );

    const renderStep = () => {
        switch (active) {
            case 1:
                return <BasicInfo formData={formData} setFormData={setFormData} />;
            case 2:
                return <BusinessInfo formData={formData} setFormData={setFormData} locationStatus={locationStatus} setLocationStatus={setLocationStatus} />;
            case 3:
                return <Services reg={false} services={services} setServices={setServices} serviceType={serviceType} setServiceType={setServiceType} />;
            case 4:
                return <WorkingHours setWorkingHours={setWorkingHours} workingHours={workingHours} />;
            default:
                return <div>Select a step</div>;
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();     // ✅ Prevent default browser action
            event.stopPropagation();    // ✅ Prevent bubbling if needed
            buttonRef.current?.click();
        }
    };


    const handleNextStep = () => {
        setActive(active + 1);
    };

    const handleSubmit = () => {
        axios.post('http://localhost:5000/business/register', {
            formData,
            services,
            workingHours
        })
            .then((response) => {
                navigate('/business/login')
            })
            .catch((error) => {
                alert(error.message);
            });
    };


    return (

        <div className="w-full " onKeyDown={handleKeyDown} tabIndex={0}>
            <div className="relative overflow-hidden">
                {/* Container Wrapper */}
                <div className="container mx-auto p-4 md:p-8 relative">

                    {/* Steps */}
                    <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 text-center gap-4">
                        {steps.map((step) => (
                            <div key={step.number} onClick={() => setActive(step.number)} className="flex flex-col items-center mb-8 relative">
                                <div
                                    className={`w-10 h-10 rounded-full border-2 border-blue-800 flex items-center justify-center text-sm font-semibold z-10 ${step.active ? 'bg-blue-800 text-blue-100' : 'text-blue-800 bg-white'
                                        }`}
                                >
                                    {step.number}
                                </div>
                                <div className="mt-2">
                                    <div className="text-black text-xs uppercase tracking-wider">
                                        Step {step.number}
                                    </div>
                                    <div className="text-blue-800 font-medium">{step.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className=" h-0.5 bg-gray-300 z-0">
                        <div
                            className="container mx-auto h-full"
                        >
                            <div className="h-full bg-gray-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="container mx-auto px-4 md:px-8">{renderStep()}</div>

            <div
                className="mt-6 w-full px-4 md:px-8
             relative md:fixed md:bottom-10 md:right-60 md:w-auto"
            >
                <button
                    ref={buttonRef}
                    onClick={active === 4 ? handleSubmit : handleNextStep}
                    type="button"
                    className="mb-5 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full md:w-auto focus:outline-none"
                >
                    {active === 4 ? 'Submit' : 'Next Step'}
                </button>


            </div>

        </div>

    );
}