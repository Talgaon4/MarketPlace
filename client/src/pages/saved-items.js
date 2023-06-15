import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";
import { Col, Row, Container, Spinner } from "react-bootstrap";

export const SavedItems = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://gaming-space.vercel.app/items");
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    const fetchSavedItems = async () => {
      try {
        const response = await axios.get(
          `http://gaming-space.vercel.app/items/savedItems/${userID}`
        );
        setSavedItems(response.data.savedItems);
      } catch (err) {
        console.log(err);
      }
    };

    fetchItems();
    fetchSavedItems();
  }, [userID]);

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
  const filteredItems = items.filter((item) => savedItems.includes(item._id));

  return (
    <Container fluid className="px-4 px-lg-5 bg-dark ">
      <div>
        <h1 className="page-title">Items</h1>
      </div>

      <Container>
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {filteredItems.map((item) => (
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
