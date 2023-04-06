import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import axios from 'axios';
import './styles.css';
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

    for (let i = 0; i < data.length; i += 3) {
        if (i + 2 < data.length) {
            rows.push(
                <CardGroup key={i}>
                    <Card onClick={() => handleClick(data[i].productCode)}>
                        <Card.Body>
                            <Card.Title>{data[i].productName}</Card.Title>
                            <Card.Text>
                                {JSON.stringify(data[i].productDescription)}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </Card.Footer>
                    </Card>
                    <Card onClick={() => handleClick(data[i + 1].productCode)}>
                        <Card.Body>
                            <Card.Title>{data[i + 1].productName}</Card.Title>
                            <Card.Text>
                                {JSON.stringify(data[i + 1].productDescription)}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </Card.Footer>
                    </Card>
                    <Card onClick={() => handleClick(data[i + 2].productCode)}>
                        <Card.Body>
                            <Card.Title>{data[i + 2].productName}</Card.Title>
                            <Card.Text>
                                {JSON.stringify(data[i + 2].productDescription)}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </Card.Footer>
                    </Card>
                </CardGroup>
            );
        } else if (i + 1 < data.length) {
            rows.push(
                <CardGroup key={i}>
                    <Card onClick={() => handleClick(data[i].productCode)}>
                        <Card.Body>
                            <Card.Title>{data[i].productName}</Card.Title>
                            <Card.Text>
                                {JSON.stringify(data[i].productDescription)}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </Card.Footer>
                    </Card>
                    <Card onClick={() => handleClick(data[i + 1].productCode)}>
                        <Card.Body>
                            <Card.Title>{data[i + 1].productName}</Card.Title>
                            <Card.Text>
                                {JSON.stringify(data[i + 1].productDescription)}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </Card.Footer>
                    </Card>
                </CardGroup>
            );
        } else {
            rows.push(
                <CardGroup key={i}>
                    <Card onClick={() => handleClick(data[i].productCode)}>
                        <Card.Body>
                            <Card.Title>{data[i].productName}</Card.Title>
                            <Card.Text>
                                {JSON.stringify(data[i].productDescription)}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </Card.Footer>
                    </Card>
                </CardGroup>
            );
        }
    }
    return (
        <div>
            {rows}
        </div>
    );
}

export default SearchPage;
