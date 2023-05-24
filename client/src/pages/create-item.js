import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import { Form, Button, Container, Image, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import astronautImage from "../images/astronaut.png";

export const CreateItem = () => {
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    if (location.state && location.state.item) {
      // If an item prop is present in the location state, update the item state
      setItem(location.state.item);
    } else {
      // It's a new item, initialize the item state
      setItem({
        name: "",
        details: "",
        cost: 0,
        imageUrl: "",
        district: "",
        phoneNumber: "",
        userOwner: userID,
      });
    }
  }, [location.state, userID]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        if (item._id) {
          // If item has an ID, it is an existing item, so perform an update
          await axios.put(
            `http://localhost:3001/items/${item._id}`,
            { ...item },
            {
              headers: { authorization: cookies.access_token },
            }
          );
          alert("Item Updated");
        } else {
          // Otherwise, it is a new item, so perform a create
          await axios.post(
            "http://localhost:3001/items",
            { ...item },
            {
              headers: { authorization: cookies.access_token },
            }
          );
          alert("Item Created");
        }
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <Container fluid className=" create-item  bg-dark">
      <div>
        <h1 className="page-title">Create Item</h1>
      </div>

      <Row className="pb-5">
        <Col className="pb-5 d-flex justify-content-center">
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

            <div className="pt-3 d-grid gap-2">
              <Button variant="outline-info" type="submit">
                {item._id ? "Edit Item" : "Create Item"}
              </Button>
            </div>
            {error && <p>{error}</p>}
          </Form>
        </Col>
        <Col  className="pb-5 d-flex justify-content-center" md="auto">
          <div className="astro">
            <Image
              width={300}
              rounded
              src={astronautImage} // Use the imported image as the source
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};
