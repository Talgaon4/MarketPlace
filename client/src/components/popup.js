import React from "react";
import { Modal, Button } from "react-bootstrap";

const Popup = ({ showModal, setShowModal, content }) => {
  return (
    
    <Modal className="modal " show={showModal} onHide={() => setShowModal(false)}>
      
      <Modal.Header closeButton>
        <Modal.Title>Item Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
    </Modal>
  );
};

export default Popup;
