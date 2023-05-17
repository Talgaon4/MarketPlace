import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Header from "../components/header";
import HeaderHome from "../components/header-home";

export const MyNavbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth");
  };

  const titleMap = {
    "/create-item": "Create Item",
    "/saved-items": "Saved Items",
    "/created-items": "My Items",
    "/auth": "Login/Register",
  };

  // Get the current path
  const currentPath = location.pathname;

  // Get the corresponding title for the current path
  const title = titleMap[currentPath] || "";

  return (
    <div className="header-wrapper">
      <div className="background-image">
        <Container>
          <Navbar bg="transparent" expand="lg">
            <Container style={{ padding: 0 }}>
              <Navbar.Brand as={Link} to="/">
                Home
              </Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/create-item">
                  Create Item
                </Nav.Link>
                <Nav.Link as={Link} to="/saved-items">
                  Saved Items
                </Nav.Link>
                <Nav.Link as={Link} to="/created-items">
                  My Items
                </Nav.Link>
                {!cookies.access_token ? (
                  <Nav.Link as={Link} to="/auth">
                    Login/Register
                  </Nav.Link>
                ) : (
                  <Nav.Link onClick={logout}>Logout</Nav.Link>
                )}
              </Nav>
            </Container>
          </Navbar>
          {currentPath === "" || currentPath === "/" ? (
            <HeaderHome title={title} />
          ) : (
            <Header title={title} />
          )}
        </Container>
      </div>
    </div>
  );
};
