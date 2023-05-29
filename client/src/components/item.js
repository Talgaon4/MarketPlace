import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import saveIcon from "../images/save-icon.png";
import savedIcon from "../images/saved-icon.png";
import ListGroup from "react-bootstrap/ListGroup";
import Popup from "./popup";
import moreDetails from "../images/more-details.png";

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
    <Card
      style={{ width: "16rem", backgroundColor: "rgba(255, 255, 255, 0.5)" }}
      className="items"
    >
      <Image
        className="align-self-center pt-3"
        style={{ width: "100%", maxWidth: "200px" }}
        rounded
        src={item.imageUrl}
        alt={item.name}
      />
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
      </Card.Body>

      <ListGroup className="list-group-flush">
        <ListGroup.Item className="transparent-bg">
          Area: {item.district}
        </ListGroup.Item>
        <ListGroup.Item className="transparent-bg">
          Price: {item.cost} ILS
        </ListGroup.Item>
      </ListGroup>
      <Card.Body className="instructions d-flex justify-content-between align-items-center">
        <div className="buttons-container">
          <a onClick={handleSaveItem} className="align-self-start">
            {isItemSaved() ? (
              <Image width={30} rounded src={savedIcon} alt="unsave" />
            ) : (
              <Image width={30} rounded src={saveIcon} alt="save" />
            )}
          </a>{" "}
          <a onClick={() => setShowModal(true)}>
            <Image width={30}  src={moreDetails} alt="more details" />
          </a>
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
                style={{ width: "100%", maxWidth: "200px" }}
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
