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
    const [payments, setPayments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const loggedIn = await checkLogin();

                if (!loggedIn) {
                    navigate("/");
                }

                const role = await getRole();

                if (role === "admin") {
                    navigate("/");
                }

                const { data } = await api.get("/payments");
                setPayments(data.info);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [navigate]);

    if (payments.length === 0) {
        return <h1>No payments</h1>;
    }

    const headers = Object.keys(payments[0])
    const renderPaymentRows = () => {
        return payments.map((payment) => {
            return (
                <div key={payment.checkNumber} className="paymentInfo">
                    {headers.map(header => {
                        return <p key={header} className="payment-P-tag">{header}: {payment[header]}</p>
                    })}
                </div>
            );
        });
    };

    return (
        <div>
            {renderPaymentRows()}
        </div>
    );
}

export default PaymentPage;
