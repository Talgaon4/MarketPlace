import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";
import { useCookies } from "react-cookie";
import { Alert } from "react-bootstrap";
import Container from "react-bootstrap/Container";

export const SavedItems = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useGetUserID();
  const [cookies] = useCookies(["access_token"]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/items/savedItems/${userId}`
        );
        setSavedItems(response.data.savedItems);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchSavedItems();
  }, [userId]);

  const isItemSaved = (itemId) => {
    return savedItems.some((item) => item._id === itemId);
  };

  const cancelSaveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3001/users/${userId}/${itemId}`, {
        headers: { authorization: cookies.access_token },
      });
      setSavedItems(savedItems.filter((item) => item._id !== itemId));
    } catch (err) {
      setError("Can't unsave item");
      console.log(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid className="px-4 px-lg-5 bg-dark ">
      <div>
        <h1 className="page-title">Items</h1>
      </div>
      <div>
        {savedItems.length === 0 ? (
          <div>No saved items found.</div>
        ) : (
          <div>
            {error && <Alert variant="danger">{error}</Alert>}
            {savedItems.map((item) => (
              <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4">
                {error && <Alert variant="danger">{error}</Alert>}
                {savedItems.map((item) => (
                  <div className="col-mb-5 my-4">
                    <Item
                      key={item._id}
                      item={item}
                      isItemSaved={() => isItemSaved(item._id)}
                      cancelSaveItem={cancelSaveItem}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};
