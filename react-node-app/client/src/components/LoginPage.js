import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { checkLogin } from './Auth';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkLogin()
            .then((result) => {
                setIsLoggedIn(result)
                if (result) {
                    navigate("/")
                }
            }).catch((err) => {
                console.log(err)
            })
    }, [isLoggedIn, navigate]);

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
        <div className='component'>
            <div className="block">
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
                            <Link id="hlink" to="/createaccount">Create Account</Link>
                            <br />
                            <Link id="hlink" to="/">Forgot Password</Link>
                        </div>
                    </div>
                    <button type="submit" className="loginButton">Sign in</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage; 