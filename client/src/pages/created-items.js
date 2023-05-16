import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Item from "../components/item";

export const CreatedItems = () => {
  const [createdItems, setCreatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userID = useGetUserID();

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
            />
          ))}
        </ul>
      )}
        
    </div>
  );
};
