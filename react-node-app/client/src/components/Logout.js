import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

function Logout() {
    const navigate = useNavigate();
    const api = axios.create({
        baseURL: 'http://localhost:3001',
        withCredentials: true
    })

    useEffect(() => {
        async function checkLogin() {
            try {
                const response = await api.get('/logout');
                console.log(response)
                const cookies = new Cookies();
                cookies.set('accessToken', response.data.accessToken, { path: '/', httpOnly: false, secure: true });
                cookies.set('refreshToken', response.data.refreshToken, { path: '/', httpOnly: false, secure: true });
                navigate("/")
            } catch (error) {
                console.log(error)
            }
        }
        checkLogin();
    }, [api, navigate]);
    return (
        <h1>Logout</h1>
    );
}

export default Logout