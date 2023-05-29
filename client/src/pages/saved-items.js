import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";

import Container from "react-bootstrap/Container";

export const SavedItems = () => {
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
          `http://localhost:3001/items/savedItems/${userID}`
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
  const filteredItems = items.filter((item) => savedItems.includes(item._id));

  return (
    <Container fluid className="px-4 px-lg-5 bg-dark ">
      <div>
        <h1 className="page-title">Items</h1>
      </div>

      <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4">
        {filteredItems.map((item) => (
          <div className="col-mb-5 my-4 d-flex" key={item._id}>
            <Item
              className="flex-grow-1"
              item={item}
              saveItem={saveItem}
              isItemSaved={() => isItemSaved(item._id)}
              cancelSaveItem={cancelSaveItem}
            />
          </div>
        ))}
      </div>
    </Container>
  );
};
