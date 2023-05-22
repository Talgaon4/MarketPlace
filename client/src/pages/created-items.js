import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
        const itemsWithDates = response.data.createdItems.map((item) => ({
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
    const editedItem = createdItems.find((item) => item._id === itemId);
    if (editedItem) {
      navigate("/create-item", { state: { item: editedItem } });
    }
  };

  return (
    <div>
      {createdItems.length === 0 ? (
        <div>You don't have any items.</div>
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
          {deleteMessage && <div>{deleteMessage}</div>}
        </ul>
      )}
    </div>
  );
};