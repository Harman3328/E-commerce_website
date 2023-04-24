import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './OrderPage.css'
import ListGroup from 'react-bootstrap/ListGroup';
import PropTypes from 'prop-types';
import { checkLogin } from './Auth';
import { getRole } from './Role';

const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true,
});

function OrderPage() {
    const { orderNumber } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [myOrders, setMyOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
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
        async function getOrders() {
            setIsLoading(true);
            try {
                if (isLoggedIn) {
                    const response = await api.get(`/order/${orderNumber}`);
                    setMyOrders(response.data.info);
                } else {
                    setMyOrders([]);
                }
            } catch (error) {
                console.error(error);
                setError('Failed to fetch orders. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }
        getOrders();
    }, [isLoggedIn, orderNumber]);


    function handleClick(productCode) {
        navigate(`/productpage/${productCode}`);
    }

    function OrderRow({ order }) {
        return (
            <ListGroup as="ol">
                <ListGroup.Item as="li" id='list-order' onClick={() => handleClick(order.productCode)}>
                    <div className="orderNumber">{order.productName}</div>
                    <div className="status">{`Quantity: ${order.quantityOrdered}`}</div>
                </ListGroup.Item>
            </ListGroup>
        );
    }

    OrderRow.propTypes = {
        order: PropTypes.object.isRequired,
    };


    if (isLoading) {
        return <h2>Loading</h2>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (myOrders.length === 0) {
        return <h3>No Orders</h3>;
    }

    return (
        <>
            {myOrders.map((order, index) => (
                <OrderRow key={index} order={order} />
            ))}
        </>
    );
}

export default OrderPage;