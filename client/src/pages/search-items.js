import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";
import { Range } from "react-range";
import { Col, Row, DropdownButton, Dropdown,Spinner } from "react-bootstrap";
import Container from "react-bootstrap/Container";

const Toolbar = ({
  selectedDistrict,
  handleDistrictChange,
  selectedCategory,
  handleCategoryChange,
  priceRange,
  handlePriceRangeChange,
}) => {
  return (
    <Row
      style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
      className="d-flex justify-content-between align-items-center mb-3 p-4"
    >
      <Col
        xs={12}
        sm={6}
        md={4}
        lg={3}
        className="d-flex justify-content-center filter pb-4 pb-sm-0"
      >
        <DropdownButton
          id="district"
          title={`Filter by District: ${
            selectedDistrict ? selectedDistrict : "All"
          }`}
          onSelect={handleDistrictChange}
        >
          <Dropdown.Item eventKey="">All</Dropdown.Item>
          <Dropdown.Item eventKey="North">North</Dropdown.Item>
          <Dropdown.Item eventKey="South">South</Dropdown.Item>
          <Dropdown.Item eventKey="Central">Central</Dropdown.Item>
        </DropdownButton>
      </Col>
      <Col
        xs={12}
        sm={6}
        md={4}
        lg={3}
        className="d-flex justify-content-center filter pb-4 pb-sm-0"
      >
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="priceRangeToggle">
            Price Range
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ width: "200px", padding: "5px 10px" }}>
            <Range
              id="priceRange"
              step={10}
              min={1}
              max={9999}
              values={priceRange}
              onChange={handlePriceRangeChange}
              renderTrack={({ props, children }) => (
                <div
                  className=" m-2"
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
          </Dropdown.Menu>
        </Dropdown>
      </Col>
      <Col
        xs={12}
        sm={6}
        md={4}
        lg={3}
        className="d-flex justify-content-center filter"
      >
        <DropdownButton
          id="category"
          title={`Filter by Category: ${
            selectedCategory ? selectedCategory : "All"
          }`}
          onSelect={handleCategoryChange}
        >
          <Dropdown.Item eventKey="">All</Dropdown.Item>
          <Dropdown.Item eventKey="Keyboards">Keyboards</Dropdown.Item>
          <Dropdown.Item eventKey="Monitors">Monitors</Dropdown.Item>
          <Dropdown.Item eventKey="Screens">Screens</Dropdown.Item>
          <Dropdown.Item eventKey="Consoles">Consoles</Dropdown.Item>
          <Dropdown.Item eventKey="Other">Other</Dropdown.Item>
        </DropdownButton>
      </Col>
    </Row>
  );
};

export const SearchItems = () => {
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([1, 9999]); // Initial price range values
  const [loading, setLoading] = useState(true);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchItems = async (district, minPrice, maxPrice, category) => {
      try {
        const response = await axios.get(
          "http://gaming-space.vercel.app/items/itemsSearch",
          {
            params: {
              district: district,
              minPrice: minPrice,
              maxPrice: maxPrice,
              category: category,
            },
          }
        );
        setItems(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedItems = async () => {
      try {
        const response = await axios.get(
          `http://gaming-space.vercel.app/items/savedItems/${userID}`
        );
        setSavedItems(response.data.savedItems);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    const [minPrice, maxPrice] = priceRange; // Destructure the price range values
    fetchItems(selectedDistrict, minPrice, maxPrice, selectedCategory);
    fetchSavedItems();
  }, [userID, selectedDistrict, priceRange, selectedCategory]);
if (loading) {
    return (
      <div
        className="bg-dark"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner animation="border" variant="info" />
      </div>
    );
  }
  const saveItem = async (itemID) => {
    try {
      const response = await axios.put("http://gaming-space.vercel.app/items/saveItem", {
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
      const response = await axios.put("http://gaming-space.vercel.app/items/saveItem", {
        itemID,
        userID,
      });
      setSavedItems(response.data.savedItems);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDistrictChange = (eventKey) => {
    setSelectedDistrict(eventKey);
  };

  const handleCategoryChange = (eventKey) => {
    setSelectedCategory(eventKey);
  };

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
  };

  return (
    <Container fluid className="px-0 bg-dark">
      <div>
        <h1 className="page-title">Items</h1>
      </div>
      <Toolbar
        selectedDistrict={selectedDistrict}
        handleDistrictChange={handleDistrictChange}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        priceRange={priceRange}
        handlePriceRangeChange={handlePriceRangeChange}
      />
      <Container>
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {items.map((item) => (
            <Col
              className="col-mb-5 my-4 d-flex  justify-content-center"
              key={item._id}
            >
              <Item
                className="flex-grow-1"
                item={item}
                saveItem={saveItem}
                isItemSaved={() => isItemSaved(item._id)}
                cancelSaveItem={cancelSaveItem}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};
