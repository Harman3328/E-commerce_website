import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './Header.css'; 

function Header() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true
  })

  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await api.get('/verifyaccesstoken');
        if (response.data.isValid) {
          setIsLoggedIn(response.data.isValid)
        } else {
          const resp = await api.get('/verifyRefreshToken')
          if (resp.data.success) {
            const cookies = new Cookies();
            setIsLoggedIn(resp.data.success)
            cookies.set('accessToken', resp.data.accessToken, {
              path: '/', httpOnly: false,
              secure: true
            });
          } else {
            setIsLoggedIn(resp.data.success)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    checkLogin();
  }, [api, isLoggedIn]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/searchpage/${searchValue}`)
    // do something with the search value, e.g. pass it to a function or fetch data from API
  };

  const rows = [];
  if (!isLoggedIn) {
    rows.push(
      <Navbar bg="dark" expand="lg" key={1}>
        <Container fluid>
          <Navbar.Brand id='fontColor' href="/">Navbar scroll</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link id='fontColor' href="/">Home</Nav.Link>
              <Nav.Link id='fontColor' href="/loginpage">Login</Nav.Link>
            </Nav>
            <Form className="d-flex" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <Button type="submit" variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  } else {
    rows.push(
      <Navbar bg="dark" expand="lg" key={1}>
        <Container fluid>
          <Navbar.Brand id='fontColor' href="/">Navbar scroll</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link id='fontColor' href="/">Home</Nav.Link>
              <NavDropdown title="Account" id="navbarScrollingDropdown">
                <NavDropdown.Item href="/orders">Orders</NavDropdown.Item>
                <NavDropdown.Item href="#action4">Payments</NavDropdown.Item>
                <NavDropdown.Item href="#action5">Info</NavDropdown.Item>
                <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form className="d-flex" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <Button type="submit" variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }

  return (
    <>
      {rows}
    </>
  );
}

export default Header;
