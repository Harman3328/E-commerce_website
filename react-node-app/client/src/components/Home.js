import React, { useState, useEffect } from "react";
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom';

/**
 * 
 * @returns Home page
 */
function Home() {
    const [data, setData] = useState([{ productName: "Loading" }]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const response = await axios.get('http://localhost:3001/productName');
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    function handleClick(id) {
        navigate(`/productpage/${id}`);
    }

    const rows = [];

    for (let i = 0; i < data.length; i++) {
        rows.push(
            <div key={i} className="Card" onClick={() => handleClick(data[i].productCode)} >
                <img className="image" src={data[i].image}></img>
                <p className="productName">{data[i].productName}</p>
            </div >
        );
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