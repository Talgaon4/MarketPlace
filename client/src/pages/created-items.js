import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";
import { Alert } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";

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
        let url = `http://localhost:3001/items/createdItems/${userID}`;
        // Check if the user is an admin
        let isAdmin = false;
        try {
          const response = await axios.get(
            `http://localhost:3001/users/${userID}`
          );
          isAdmin = response.data?.isAdmin || false;
        } catch (err) {
          console.log(err);
        }

        if (isAdmin) {
          url = `http://localhost:3001/items`;
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
          `http://localhost:3001/items/savedItems/${userID}`
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
    return <div>Loading...</div>;
  }
  const saveItem = async (itemID) => {
    try {
      const response = await axios.put("http://localhost:3001/items/saveItem", {
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
      const response = await axios.put("http://localhost:3001/items/saveItem", {
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
      await axios.delete(`http://localhost:3001/items/${itemId}`);
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
    <Container fluid className="px-4 px-lg-5 bg-dark">
      <h1 className="page-title">My Items</h1>
      <div>
        {createdItems.length === 0 ? (
          <div>You don't have any items.</div>
        ) : (
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 ">
            {createdItems.map((item) => (
              <div className="col-mb-5 my-4 d-flex" key={item._id}>
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
              </div>
            ))}
            {deleteMessage && <div>{deleteMessage}</div>}
          </div>
        )}
      </div>
    </Container>
  );
};
