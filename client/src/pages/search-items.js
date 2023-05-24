import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";
import { Range } from "react-range";

import Container from "react-bootstrap/Container";

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
    <Container fluid className="px-4 px-lg-5 bg-dark ">
      <div>
        <h1 className="page-title">Items</h1>
      </div>
      <div className="d-flex align-items-start filter">
        <label htmlFor="district">Filter by District: &nbsp;</label>
        <select
          className="dropdown ml-3"
          id="district"
          value={selectedDistrict}
          onChange={handleDistrictChange}
        >
          <option value="">All</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="Central">Central</option>
        </select>
      </div>
      <div className="filter p-3">
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
              className="my-2"
              {...props}
              style={{
                ...props.style,
                height: "6px",
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{priceRange[0]}</span>
          <span>{priceRange[1]}</span>
        </div>
      </div>
      <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4">
        {items.map((item) => (
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
    </Container>
  );
};
