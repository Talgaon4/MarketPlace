import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";
import { Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export const CreatedItems = () => {
  const [createdItems, setCreatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [error, setError] = useState("");
  const userID = useGetUserID();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreatedItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/items/createdItems/${userID}`
        );
        setCreatedItems(response.data.createdItems);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchCreatedItems();
  }, [userID]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
    // Find the item that needs to be edited
    const editedItem = createdItems.find((item) => item._id === itemId);
    if (editedItem) {
      // Navigate to the CreateItem component with the item details as props
      navigate("/create-item", { state: { item: editedItem } });
    }
  };
  return (
    <div>
      <h1>My Items</h1>
      {createdItems.length === 0 ? (
        <div>You dont have items yet.</div>
      ) : (
        <ul>
          {createdItems.map((item) => (
            <Item
              key={item._id}
              item={item}
              isItemSaved={() => true}
              cancelSaveItem={() => {}}
            >
              <React.Fragment>
                <Button
                  className="my-1"
                  variant="outline-info"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  Delete
                </Button>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button
                  className="my-1"
                  variant="outline-info"
                  to={`/create-item/${item._id}`}
                  onClick={() => handleEditItem(item._id)}
                >
                  Edit
                </Button>
              </React.Fragment>
            </Item>
          ))}
          {deleteMessage && <div>{deleteMessage}</div>}{" "}
        </ul>
      )}
    </div>
  );
};
