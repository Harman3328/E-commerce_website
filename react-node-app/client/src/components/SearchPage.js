import React, { useState, useEffect } from "react";
import axios from 'axios';
import './SearchPage.css';
import { useNavigate, useParams } from 'react-router-dom';

function SearchPage() {
    const { searchValue } = useParams();
    const [data, setData] = useState([{ productName: "Loading" }]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.post(`http://localhost:3001/search/${searchValue}`);
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [searchValue]);

    if (data.length === 0) {
        return (
            <h1>results for: {searchValue}</h1>
        );
    }
    function handleClick(id) {
        navigate(`/productpage/${id}`);
    }

    const rows = [];

    for (let i = 0; i < data.length; i++) {
        rows.push(
            <div key={data[i].productCode} className="Card" onClick={() => handleClick(data[i].productCode)} >
                <p className="productName">{data[i].productName}</p>
            </div >
        );
    }
    return (
        <div>
            {rows}
        </div>
    );
}

export default SearchPage;
