import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import './OrderPage.css'

const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true,
});

function OrderPage() {
    const { orderNumber } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkLogin() {
            try {
                const response = await api.get('/verifyaccesstoken');
                if (response.data.isValid) {
                    setIsLoggedIn(response.data.isValid);
                } else {
                    const resp = await api.get('/verifyRefreshToken');
                    if (resp.data.success) {
                        const cookies = new Cookies();
                        setIsLoggedIn(resp.data.success);
                        if (!resp.data.success) {
                            navigate('/loginpage')
                        }
                        cookies.set('accessToken', resp.data.accessToken, {
                            path: '/',
                            httpOnly: false,
                            secure: true,
                        });
                    } else {
                        setIsLoggedIn(resp.data.success);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        checkLogin();
    }, []);
    console.log(orderNumber)
    return (
        <h3>here</h3>
    );
}

export default OrderPage;