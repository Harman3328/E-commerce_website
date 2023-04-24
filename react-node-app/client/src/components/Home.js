import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom';

/**
 * 
 * @returns Home page
 */
function Home() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get('http://localhost:3001/products');
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    function handleClick(id) {
        navigate(`/productpage/${id}`);
    }

    const rows = [];
    if (data.length !== 0) {
        var prodLine = ""

        for (let i = 0; i < data.length; i++) {
            if (prodLine !== data[i].productLine) {
                prodLine = data[i].productLine;
                rows.push(
                    <div key={i} className="productLine-title">
                        <h1>{data[i].productLine}</h1>
                    </div>
                )
            }

            rows.push(
                <div key={data[i].productCode} className="Card" onClick={() => handleClick(data[i].productCode)} >
                    <p className="productName">{data[i].productName}</p>
                </div >
            );
        }
    }

    return (
        <div className="my-component">
            <div className="cardGroup">
                {rows}
            </div>
        </div>
    );
}

export default Home;
