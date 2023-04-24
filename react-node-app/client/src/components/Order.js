import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    const [orderData, setOrderData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkLogin()
            .then((isLoggedIn) => {
                if (!isLoggedIn) {
                    throw new Error('User not logged in');
                }
                return getRole();
            })
            .then((role) => {
                if (role === 'admin') {
                    throw new Error('Admins cannot view orders');
                }
                return api.get(`/order/${orderNumber}`);
            })
            .then((response) => {
                setOrderData(response.data.info);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [orderNumber]);

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

    if (orderData.length === 0) {
        return <h3>No Orders</h3>;
    }

    return (
        <>
            {orderData.map((order) => (
                <OrderRow key={order.orderNumber} order={order} />
            ))}
        </>
    );
}

export default OrderPage;
