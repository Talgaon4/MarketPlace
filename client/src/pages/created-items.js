import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";
import { useNavigate } from "react-router-dom";
import { Col, Row, Spinner, Container } from "react-bootstrap";

export const CreatedItems = () => {
  const [createdItems, setCreatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedItems, setSavedItems] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [error, setError] = useState("");
  const userID = useGetUserID();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreatedItems = async () => {
      try {
        let url = `http://gaming-space.vercel.app/items/createdItems/${userID}`;
        // Check if the user is an admin
        let isAdmin = false;
        try {
          const response = await axios.get(
            `http://gaming-space.vercel.app/users/${userID}`
          );
          isAdmin = response.data?.isAdmin || false;
        } catch (err) {
          console.log(err);
        }

        if (isAdmin) {
          url = `http://gaming-space.vercel.app/items`;
        }

        const responseItems = await axios.get(url);
        const itemsWithDates = responseItems.data.createdItems.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt).toLocaleDateString(),
        }));
        setCreatedItems(itemsWithDates);
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
    fetchSavedItems();
    fetchCreatedItems();
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
  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://gaming-space.vercel.app/items/${itemId}`);
      setCreatedItems(createdItems.filter((item) => item._id !== itemId));
      setDeleteMessage("Item deleted successfully.");
    } catch (err) {
      setError("Can't delete item");
      console.log(err);
    }
  };

  const handleEditItem = (itemId) => {
    const editedItem = createdItems.find((item) => item._id === itemId);
    if (editedItem) {
      navigate(`/create-item/${itemId}`, { state: { item: editedItem } });
    }
  };

  const isCreatedByCurrentUser = (itemId) => {
    const createdItem = createdItems.find((item) => item._id === itemId);
    return createdItem && createdItem.createdBy === userID;
  };

  return (
    <Container fluid className="bg-dark">
      <h1 className="page-title">My Items</h1>
      <div>
        {createdItems.length === 0 ? (
          <div>You don't have any items.</div>
        ) : (
          <Container>
            <Row xs={1} md={2} lg={3} xl={4} className="g-4">
              {createdItems.map((item) => (
                <Col
                  className="col-mb-5 my-4 d-flex d-flex  justify-content-center"
                  key={item._id}
                >
                  <Item
                    className="flex-grow-1"
                    item={item}
                    saveItem={saveItem}
                    isItemSaved={() => isItemSaved(item._id)}
                    cancelSaveItem={cancelSaveItem}
                    isCreatedByCurrentUser={isCreatedByCurrentUser}
                    handleDeleteItem={handleDeleteItem}
                    handleEditItem={handleEditItem}
                  />
                </Col>
              ))}
              {deleteMessage && <div>{deleteMessage}</div>}
            </Row>
          </Container>
        )}
      </div>
    </Container>
  );
};
