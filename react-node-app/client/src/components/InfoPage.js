import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from './Auth';
import "./InfoPage.css"

const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true,
});

function InfoPage() {
    const [personalInfo, setPersonalInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkLogin()
            .then((isLoggedIn) => {
                if (!isLoggedIn) {
                    navigate("/loginpage")
                }
                return api.get("/customerinfo");
            })
            .then((response) => {
                setPersonalInfo(response.data.info);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [navigate]);

    const renderPersonalInfo = () => {
        const [info] = personalInfo;
        const headers = Object.keys(info).filter(header => header !== "password");
        return (
            <div key={info[headers[0]]} className="personal-info">
                {headers.map((header) => (
                    info[header] ? (
                        <p key={header} className="personal-info-p-tag">
                            {header.replace(/([A-Z])(?=[A-Z][a-z])|([a-z])(?=[A-Z])/g, '$1$2 ')}: {info[header]}
                        </p>
                    ) : null
                ))}
            </div>
        );
    };


    if (isLoading) {
        return <h2>Loading</h2>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (personalInfo.length === 0) {
        return <h3>No person Info</h3>;
    }

    return (
        <div>
            {renderPersonalInfo()}
        </div>
    );
}

export default InfoPage;
