import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductPage.css';
import { checkLogin } from "./Auth";
import { getRole } from "./Role";

function ProductPage() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [quantity, setQuanity] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState()
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const loggedIn = await checkLogin(); 
                setIsLoggedIn(loggedIn)
                const permission = await getRole();
                setRole(permission)
                const response = await axios.post(`http://localhost:3001/product/${id}`);
                setData(response.data);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch product data. Please try again later.');
            }
        }
        fetchData();
    }, [id]);

    function handleQuanityChange(event) {
        setQuanity(event.target.value)
    }

    function handleSumbit() {
        if (!isLoggedIn) {
            navigate("/loginpage")
        } else if (role === "admin") {
            alert("Admins can't place orders")
        } else {
            console.log("pass")
        }
    }

    const renderProductPage = () => {
        const [productData] = data;
        const headers = Object.keys(productData).filter(header => header !== "productCode" && header !== "image");
        return (
            <div key={id} className="product-info">
                <h1 className="product-title">{productData.productName}</h1>
                {headers.map(header => (
                    <p key={header} className="product-p-tag">
                        {header.replace(/([A-Z])(?=[A-Z][a-z])|([a-z])(?=[A-Z])/g, '$1$2 ')}: {productData[header]}
                    </p>
                ))}
            </div>
        );
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="product-page">
            {data.length > 0 ? renderProductPage() : <h1>Loading...</h1>}
            <div className="product-page-form">
                <form onSubmit={handleSumbit}>
                    <input type="text" className="product-page-quanity-input" value={quantity} onChange={handleQuanityChange}></input>
                    <button type="submit" className="product-page-button">Add</button>
                </form>
            </div>
        </div>
    );
}

export default ProductPage;
