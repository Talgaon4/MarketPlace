import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";

export const SavedItems = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/items/savedItems/${userID}`
        );
        setSavedItems(response.data.savedItems);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchSavedItems();
  }, [userID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {savedItems.length === 0 ? (
        <div>No saved items found.</div>
      ) : (
        <ul>
          {savedItems.map((item) => (
            <Item
              key={item._id}
              item={item}
              isItemSaved={() => true}
              cancelSaveItem={() => {}}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
