import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Form, Button } from "react-bootstrap";

export const CreateItem = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [item, setItem] = useState({
    name: "",
    details: "",
    cost: 0,
    imageUrl: "",
    district: "",
    phoneNumber: "",
    userOwner: userID,
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await axios.post(
          "http://localhost:3001/items",
          { ...item },
          {
            headers: { authorization: cookies.access_token },
          }
        );
        alert("Item Created");
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const validateForm = () => {
    if (
      item.name.trim() === "" ||
      item.details.trim() === "" ||
      item.cost <= 0 ||
      item.imageUrl.trim() === "" ||
      item.district.trim() === "" ||
      item.phoneNumber.trim() === ""
    ) {
      setError("Please fill in all fields.");
      return false;
    }
    setError("");
    return true;
  };

  return (
    <div className="create-item">
      <h2>Create Item</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="name"
            value={item.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="details">
          <Form.Label>Details</Form.Label>
          <Form.Control
            as="textarea"
            name="details"
            value={item.details}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="district">
          <Form.Label>District</Form.Label>
          <Form.Select
            as="select"
            name="district"
            value={item.district}
            onChange={handleChange}
          >
            <option value="">Select District</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="Central">Central</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="phoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            name="phoneNumber"
            value={item.phoneNumber}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="imageUrl">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            name="imageUrl"
            value={item.imageUrl}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="cost">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            min="1"
            step="any"
            name="cost"
            value={item.cost}
            onChange={handleChange}
          />
        </Form.Group>

        <div class="pt-3 d-grid gap-2">
          <Button variant="outline-info" type="submit">
            Create Item
          </Button>
        </div>
        {error && <p>{error}</p>}
      </Form>
    </div>
  );
};
