import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Range } from "react-range";

export const SearchItems = () => {
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [priceRange, setPriceRange] = useState([1, 9999]); // Initial price range values
  const userID = useGetUserID();

  useEffect(() => {
    const fetchItems = async (district, minPrice, maxPrice) => {
      try {
        const response = await axios.get("http://localhost:3001/items", {
          params: {
            district: district,
            minPrice: minPrice,
            maxPrice: maxPrice,
          },
        });
        setItems(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/items/savedItems/ids/${userID}`
        );
        setSavedItems(response.data.savedItems);
      } catch (err) {
        console.log(err);
      }
    };

    const [minPrice, maxPrice] = priceRange; // Destructure the price range values
    fetchItems(selectedDistrict, minPrice, maxPrice);
    fetchSavedItems();
  }, [userID, selectedDistrict, priceRange]);

  const saveItem = async (itemID) => {
    try {
      const response = await axios.put("http://localhost:3001/items", {
        itemID,
        userID,
      });
      setSavedItems(response.data.savedItems);
    } catch (err) {
      console.log(err);
    }
  };

  const isItemSaved = (id) => savedItems && savedItems.includes(id);

  const cancelSaveItem = async (itemID) => {
    try {
      const response = await axios.put("http://localhost:3001/items", {
        itemID,
        userID,
      });
      setSavedItems(response.data.savedItems);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
  };

  return (
    <container className="main-div px-4 px-lg-5 mt-5">
      <div>
        <h1>Items</h1>
      </div>
      <div>
        <label htmlFor="district">Filter by District:</label>
        <select id="district" value={selectedDistrict} onChange={handleDistrictChange}>
          <option value="">All</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="Central">Central</option>
        </select>
      </div>
      <div>
        <label htmlFor="priceRange">Price Range:</label>
        <Range
          id="priceRange"
          step={10}
          min={1}
          max={9999}
          values={priceRange}
          onChange={handlePriceRangeChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "6px",
                width: "100%",
                backgroundColor: "#ccc",
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "16px",
                width: "16px",
                backgroundColor: "#999",
                borderRadius: "50%",
                outline: "none",
              }}
            />
          )}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{priceRange[0]}</span>
          <span>{priceRange[1]}</span>
        </div>
      </div>
      <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4">
        {items.map((item, index) => (
          <div className="col-mb-5 my-4" key={item._id}>
            <Item
              className=""
              item={item}
              saveItem={saveItem}
              isItemSaved={() => isItemSaved(item._id)}
              cancelSaveItem={cancelSaveItem}
            />
          </div>
        ))}
      </div>
    </container>
  );
};
