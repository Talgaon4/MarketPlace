import React from "react";
import { Card, Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import ListGroup from "react-bootstrap/ListGroup";

const Item = ({ item, saveItem, isItemSaved, cancelSaveItem, children }) => {
  const handleSaveItem = () => {
    if (isItemSaved) {
      cancelSaveItem(item._id);
    } else {
      saveItem(item._id);
    }
  };

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
        <ListGroup.Item>Created on: {item.createdAt}</ListGroup.Item>
      </ListGroup>
      <Card.Body className="instructions">
        <Button onClick={handleSaveItem}>
          {isItemSaved() ? "Cancel Save" : "Save"}
        </Button>
      </Card.Body>
      {children} {/* Render the children here */}
    </Card>
  );
};

export default Item;
