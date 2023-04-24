import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductPage.css'

function ProductPage() {
    const { id } = useParams();
    const [data, setData] = useState([{ productName: "Loading" }]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.post(`http://localhost:3001/product/${id}`);
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [id]);

    return (
        <div className="product-page">
            <h1>{data[0].productName}</h1>
            <p>Description: {data[0].productDescription}</p>
            <p>Buy Price: {data[0].buyPrice}</p>
            <p>MSRP: {data[0].MSRP}</p>
            <p>Product Line: {data[0].productLine}</p>
            <p>Product Scale: {data[0].productScale}</p>
            <p>Product Vendor: {data[0].productVendor}</p>
            <p>Quantity: {data[0].quantityInStock}</p>
        </div>
    );
}

export default ProductPage;
