import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import saveIcon from "../images/save-icon.png";
import savedIcon from "../images/saved-icon.png";
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
    <Card style={{ width: "16rem" }} className="items">
      <Image
        className="align-self-center pt-3"
        width={100}
        height={130}
        rounded
        src={item.imageUrl}
        alt={item.name}
      />
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>{item.details}</Card.Text>
      </Card.Body>

      <ListGroup className="list-group-flush">
        <ListGroup.Item>Area: {item.district}</ListGroup.Item>
        <ListGroup.Item>Price: {item.cost} ILS</ListGroup.Item>
      </ListGroup>
      <Card.Body className="instructions d-flex justify-content-between align-items-center">
        <div className="buttons-container">
          <a onClick={handleSaveItem} className="align-self-start">
            {isItemSaved() ? (
              <Image width={50} rounded src={savedIcon} alt="unsave" />
            ) : (
              <Image width={50} rounded src={saveIcon} alt="save" />
            )}
          </a>{" "}
          <Button className="btn" onClick={() => setShowModal(true)}>
            More details
          </Button>
        </div>
      </Card.Body>

      {showModal && (
        <Popup
          showModal={showModal}
          setShowModal={setShowModal}
          content={
            <div className="d-flex flex-column">
              <h4>Item Name: {item.name}</h4>
              <Image
                className="align-self-center pt-3"
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
