import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";

export const Auth = () => {
  const [showRegister, setShowRegister] = useState(false);

  const handleToggleForm = () => {
    setShowRegister(!showRegister);
  };

  return (
    <div className="auth">
      {showRegister ? (
        <Register handleToggleForm={handleToggleForm} />
      ) : (
        <Login handleToggleForm={handleToggleForm} />
      )}
    </div>
  );
};

const Login = ({ handleToggleForm }) => {
  const [_, setCookies] = useCookies(["access_token"]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post("https://gaming-space-api.onrender.com/auth/login", {
        username,
        password,
      });

      setCookies("access_token", result.data.token);
      window.localStorage.setItem("userID", result.data.userID);
      navigate("/");
    } catch (error) {
      setError("Invalid username or password");
      console.error(error);
    }
  };

  return (
    <Container fluid className="create-item bg-dark">
      <div>
        <h1 className="page-title">Login</h1>
      </div>
      <Row className="pb-5">
        <Col className="pb-5 d-flex flex-column align-items-center ">
          <Form className="align-self-center" onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="username">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Group>
            <div className="pt-2">
              <Button className="btn2" variant="primary" type="submit">
                Login
              </Button>
            </div>{" "}
            <div className="pt-3">
              <Button
                variant="outline-info"
                type="button"
                onClick={handleToggleForm}
              >
                Unregistered? Press here
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

const Register = ({ handleToggleForm }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Check if the username is available
      if (!username) {
        setError("Username is required");
        return;
      }

      const usernameAvailability = await axios.get(
        `https://gaming-space-api.onrender.com/auth/check-availability?username=${username}`
      );

      if (!usernameAvailability.data.available) {
        setError("Username is not available");
        return;
      }

      if (!password) {
        setError("Password is required");
        return;
      }

      if (password !== passwordConfirmation) {
        setError("Passwords do not match");
        return;
      }

      await axios.post("https://gaming-space-api.onrender.com/auth/register", {
        username,
        password,
      });

      setError("");
      setSuccessMessage("Registration completed! Please login.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container fluid className="create-item bg-dark">
      <div>
        <h1 className="page-title">Register</h1>
      </div>
      <Row className="pb-5  ">
        <Col className="pb-5 d-flex flex-column align-items-center ">
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}
            <Form.Group controlId="username">
              <Form.Label controlId="username">Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label controlId="password">Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="passwordConfirmation">
              <Form.Label controlId="passwordConfirmation">
                Confirm Password:
              </Form.Label>
              <Form.Control
                type="password"
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
              />
            </Form.Group>
            <div className="pt-2 ">
              <Button variant="primary" type="submit" className="btn2">
                Register
              </Button>
            </div>{" "}
            <div className="pt-3">
              <Button
                variant="outline-warning"
                type="button"
                onClick={handleToggleForm}
              >
                Already have an account? Press here
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
