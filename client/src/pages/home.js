import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";
import { Card, Button, Row, Col } from "react-bootstrap";

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
    <container class="main-div px-4 px-lg-5 mt-5">
      <div>
        <h1>Items</h1>
      </div>
      <div className=" row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 ">
        {items.map((item, index) => (
          <div className=" col-mb-5 my-4" key={item._id}>
            <Item
              className=""
              item={item}
              saveItem={saveItem}
              isItemSaved={() => isItemSaved(item._id)}
              cancelSaveItem={cancelSaveItem}
            />
          </div>
        ))}
      </div>
    </container>
  );
};
