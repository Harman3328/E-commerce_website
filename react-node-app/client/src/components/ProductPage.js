import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductPage.css'

function ProductPage() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.post(`http://localhost:3001/product/${id}`);
                setData(response.data);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch product data. Please try again later.');
            }
        }
        fetchData();
    }, [id]);

    const renderProductPage = () => {
        const [productData] = data;
        const headers = Object.keys(productData).filter(header => header !== "productCode");
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
        </div>
    );
}

export default ProductPage;
