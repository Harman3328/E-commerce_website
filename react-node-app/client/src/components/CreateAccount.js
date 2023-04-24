import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateAccount.css'
import { checkLogin } from './Auth';

/**
 * sends a request to the server with an email and password
 * if no errors occured, the account was created and redirects user to the login page
 * @returns creates the create account page 
 */
function CreateAccount() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setComfirmPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkLogin()
            .then((result) => {
                setIsLoggedIn(result)
                if (!result) {
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

    function handleComfirmPasswordChange(event) {
        setComfirmPassword(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (password !== confirmPassword && password.length === 0) {
            setPassword('');
            setComfirmPassword('');
            alert("Passwords don't match");
        } else {
            try {
                const response = await axios.post('http://localhost:3001/createaccount', {
                    email,
                    password
                });
                if (response.data.success) {
                    navigate('/loginpage')
                } else {
                    setEmail('');
                    setPassword('');
                    setComfirmPassword('');
                    alert("Incorrect Username");
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className='block'>
            <form onSubmit={handleSubmit}>
                <h1 className='page-title'>Create Account Page</h1>
                <div className="row mb-3">
                    <div className="col-sm-10">
                        <input type="userName" className="form-control" id="inputEmail3" value={email} onChange={handleEmailChange}
                            placeholder='Employee/Customer Number' />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="inputPassword3" value={password} onChange={handlePasswordChange}
                            placeholder='Password' />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="inputPassword4" value={confirmPassword} onChange={handleComfirmPasswordChange}
                            placeholder='Comfirm Password' />
                    </div>
                </div>
                <button type="submit" className="loginButton">Create Account</button>
            </form>
        </div>
    );
}

export default CreateAccount;
