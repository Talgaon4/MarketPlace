import React, { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

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
    <div className="create-items">
      <h2>Create Item</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={item.name}
          onChange={handleChange}
        />
        <label htmlFor="details">Details</label>
        <textarea
          id="details"
          name="details"
          value={item.details}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="district">District</label>
        <select
          id="district"
          name="district"
          value={item.district}
          onChange={handleChange}
        >
          <option value="">Select District</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="Central">Central</option>
        </select>

        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={item.phoneNumber}
          onChange={handleChange}
        />

        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={item.imageUrl}
          onChange={handleChange}
        />

        <label htmlFor="cost">Price</label>
        <input
          type="number"
          min="1"
          step="any"
          id="cost"
          name="cost"
          value={item.cost}
          onChange={handleChange}
        />
        <button type="submit">Create Item</button>
        {error && <p>{error}</p>}
      </form>
        
    </div>
  );
};
