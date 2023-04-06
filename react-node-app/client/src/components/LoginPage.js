import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const api = axios.create({
        baseURL: 'http://localhost:3001',
        withCredentials: true
    })

    useEffect(() => {
        async function checkLogin() {
            try {
                const response = await api.get('/verifyaccesstoken');
                if (response.data.isValid) {
                    setIsLoggedIn(response.data.isValid)
                } else {
                    const resp = await api.get('/verifyRefreshToken')
                    if (resp.data.success) {
                        const cookies = new Cookies();
                        setIsLoggedIn(resp.data.success)
                        cookies.set('accessToken', resp.data.accessToken, { path: '/', httpOnly: false, 
                        secure: true });
                    } else {
                        setIsLoggedIn(resp.data.success)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        checkLogin();
    }, [api]);

    /*useEffect(() => {
        if (isLoggedIn) {
            navigate("/")
        }
    }, [isLoggedIn, navigate]);*/

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3001/login`, {
                email,
                password
            })
            const cookies = new Cookies();
            cookies.set('accessToken', response.data.accessToken, { path: '/', httpOnly: false, secure: true });
            cookies.set('refreshToken', response.data.refreshToken, { path: '/', httpOnly: false, secure: true });
            if (response.data.success) {
                navigate("/")
            } else {
                alert(response.data.err)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='LoginPage'>
            <form onSubmit={handleSubmit}>
                <h1 className='page-title'>Login Page</h1>
                <div className="row mb-3">
                    <div className="col-sm-10">
                        <input type="username" className="form-control" id="inputEmail3" value={email} onChange={handleEmailChange}
                            placeholder='Employee/Customer Number' />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="inputPassword3" value={password} onChange={handlePasswordChange}
                            placeholder='Password' />
                    </div>
                </div>
                <div className="col-sm-10">
                    <div className="hyperlinks">
                        <Link className="hlink" to="/createaccount">Create Account</Link>
                        <br />
                        <Link className="hlink" to="/">Forgot Password</Link>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" id='loginButton'>Sign in</button>
            </form>
        </div>
    );
}

export default LoginPage; 