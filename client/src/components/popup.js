import React from "react";
import { Modal, Button } from "react-bootstrap";

const Popup = ({ showModal, setShowModal, content }) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Item Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        {/* Add any additional buttons or actions */}
      </Modal.Footer>
    </Modal>
  );
};

export default Popup;
