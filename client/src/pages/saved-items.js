import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";
import { useCookies } from "react-cookie";
import { Alert } from "react-bootstrap";

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
    <div>
      {savedItems.length === 0 ? (
        <div>No saved items found.</div>
      ) : (
        <ul>
          {error && <Alert variant="danger">{error}</Alert>}
          {savedItems.map((item) => (
            <Item
              key={item._id}
              item={item}
              isItemSaved={() => isItemSaved(item._id)}
              cancelSaveItem={cancelSaveItem}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
