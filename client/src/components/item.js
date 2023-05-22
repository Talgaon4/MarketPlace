import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import ListGroup from "react-bootstrap/ListGroup";
import Popup from "./popup";

const Item = ({ item, saveItem, isItemSaved, cancelSaveItem, children }) => {
  const [showModal, setShowModal] = useState(false);

  const handleSaveItem = () => {
    if (isItemSaved) {
      cancelSaveItem(item._id);
    } else {
      saveItem(item._id);
    }
  };

  let formattedDate = "N/A";
  console.log(item.createdAt);
  if (
    item.createdAt &&
    new Date(item.createdAt).toString() !== "Invalid Date"
  ) {
    formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>{item.details}</Card.Text>
      </Card.Body>
      <Image
        width={171}
        height={180}
        rounded
        src={item.imageUrl}
        alt={item.name}
      />
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Area: {item.district}</ListGroup.Item>
        <ListGroup.Item>Phone number: {item.phoneNumber}</ListGroup.Item>
        <ListGroup.Item>Price: {item.cost} ILS</ListGroup.Item>
        <ListGroup.Item>Created on: {formattedDate}</ListGroup.Item>
      </ListGroup>
      <Card.Body className="instructions">
        <Button onClick={handleSaveItem}>
          {isItemSaved() ? "Cancel Save" : "Save"}
        </Button>
      </Card.Body>
      <Card.Body className="instructions">
        <Button onClick={() => setShowModal(true)}>More details</Button>
      </Card.Body>
      {showModal && (
        <Popup
          showModal={showModal}
          setShowModal={setShowModal}
          content={
            <div>
              <h4>Item Name: {item.name}</h4>
              <Image
                width={171}
                height={180}
                rounded
                src={item.imageUrl}
                alt={item.name}
              />
              <ListGroup.Item>Area: {item.district}</ListGroup.Item>
              <ListGroup.Item>Phone number: {item.phoneNumber}</ListGroup.Item>
              <ListGroup.Item>Price: {item.cost} ILS</ListGroup.Item>
              <ListGroup.Item>Created on: {formattedDate}</ListGroup.Item>
              <p>Item Description: {item.details}</p>
            </div>
          }
        />
      )}
      {children}
    </Card>
  );
};

export default Item;
