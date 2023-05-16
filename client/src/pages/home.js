import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";

export const Home = () => {
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:3001/items");
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

    fetchItems();
    fetchSavedItems();
  }, [userID]);

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

  return (
    <div>
      <h1>Items</h1>
      <ul>
      {items.map((item) => (
      <Item
        key={item._id}
        item={item}
        saveItem={saveItem}
        isItemSaved={() => isItemSaved(item._id)}
        cancelSaveItem={cancelSaveItem}
      />
    ))}
      </ul>
    </div>
  );
};