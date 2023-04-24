import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { checkLogin } from "./Auth";
import { getRole } from "./Role";
import "./PaymentPage.css"


const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true,
});

function PaymentPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [payments, setPayments] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        checkLogin()
            .then((result) => {
                setIsLoggedIn(result)
                if (!result) {
                    navigate("/")
                }
                getRole()
                    .then((result) => {
                        if (result === "admin") {
                            navigate("/")
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
            }).catch((err) => {
                console.log(err)
            })
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        async function getPayments() {
            const response = await api.get("/payments")
            setPayments(response.data.info)
        }
        getPayments()
    }, [])

    if (payments.length === 0) {
        return (
            <h1>No payments</h1>
        )
    }

    const rows = []

    for (let i = 0; i < payments.length; i++) {
        rows.push(
            <div key={i} className="paymentInfo">
                <p className="payment-P-tag">checkNumber: {payments[i].checkNumber}</p>
                <p className="payment-P-tag">Payment Date: {payments[i].paymentDate}</p>
                <p className="payment-P-tag">Amount: ${payments[i].amount}</p>
            </div>
        )
    }
    return (
        <div>
            {rows}
        </div>
    )
}

export default PaymentPage