import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";

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
      const result = await axios.post("http://localhost:3001/auth/login", {
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
    <container class="main-div px-4 px-lg-5 mt-5">
      <div className="auth-container">
        <Form onSubmit={handleSubmit}>
          <h2>Login</h2>
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
            <Button variant="primary" type="submit">
              Login
            </Button>
          </div>
        </Form>
        <div className="pt-2">
          <Button
            variant="outline-info"
            type="button"
            onClick={handleToggleForm}
          >
            Unregistered? Press here
          </Button>
        </div>
      </div>
    </container>
  );
};

const Register = ({ handleToggleForm }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
      });
      alert("Registration Completed! Now login.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <container class="main-div px-4 px-lg-5 mt-5">
      <div className="">
        <Form onSubmit={handleSubmit}>
          <h2>Register</h2>
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
          <div className="pt-2">
            <Button variant="primary" type="submit">
              Register
            </Button>
          </div>
        </Form>
        <div className="pt-2">
          <Button
            variant="outline-warning"
            type="button"
            onClick={handleToggleForm}
          >
            Allready have an acount? Press here
          </Button>
        </div>
      </div>
    </container>
  );
};
