import React from "react";

const Item = ({ item, saveItem, isItemSaved, cancelSaveItem }) => {
  const handleSaveItem = () => {
    if (isItemSaved()) {
      cancelSaveItem(item._id);
    } else {
      saveItem(item._id);
    }
  };

  return (
    <li key={item._id}>
      <div>
        <h2>{item.name}</h2>
        <button onClick={handleSaveItem}>
          {isItemSaved() ? "Cancel Save" : "Save"}
        </button>
      </div>
      <div className="instructions">
        <p>{item.details}</p>
        <p>{item.district}</p>
      </div>
      <img src={item.imageUrl} alt={item.name} />
      <p>Phone number: {item.phoneNumber} </p>
      <p>Price: {item.cost} shekels</p>
    </li>
  );
};

export default Item;