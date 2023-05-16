import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth");
  };
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">React Bootstrap</Navbar.Brand>
        <Nav className="mr-auto">
          <Link to="/">Home</Link>
          <Link to="/create-item">Create Item</Link>
          <Link to="/saved-items">Saved Items</Link>
          <Link to="/my-items">My Items</Link>
        </Nav>
        {!cookies.access_token ? (
          <Link to="/auth">Login/Register</Link>
        ) : (
          <Button variant="primary" onClick={logout}>Logout</Button>
        )}
      </Container>
    </Navbar>
  );
};
