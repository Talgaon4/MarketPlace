import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import Image from "react-bootstrap/Image";
import axios from "axios";
import Item from "../components/item";
import { Alert, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import deleteIcon from "../images/delete-icon.png";
import editIcon from "../images/edit.png";

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
      navigate(`/create-item/${itemId}`, { state: { item: editedItem } });
    }
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
              <div className="col-mb-5 my-4" key={item._id}>
                <Item
                  item={item}
                  isItemSaved={() => true}
                  cancelSaveItem={() => {}}
                >
                  <Card.Body className="instructions d-flex justify-content-between align-items-center">
                    <div className="buttons-container">
                      <a
                        className="my-1"
                        variant="outline-info"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        <Image
                          width={30}
                          rounded
                          src={deleteIcon}
                          alt="delete"
                        />
                      </a>
                      {error && <Alert variant="danger">{error}</Alert>}
                      <a
                        className="my-1"
                        variant="outline-info"
                        onClick={() => handleEditItem(item._id)}
                      >
                        <Image width={30} rounded src={editIcon} alt="edit" />
                      </a>
                    </div>
                  </Card.Body>
                </Item>
              </div>
            ))}
            {deleteMessage && <div>{deleteMessage}</div>}
          </div>
        )}
      </div>
    </Container>
  );
};
