import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Logout() {
    const navigate = useNavigate();
    const api = axios.create({
        baseURL: 'http://localhost:3001',
        withCredentials: true
    })

    useEffect(() => {
        async function checkLogin() {
            try {
                await api.get('/logout');
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