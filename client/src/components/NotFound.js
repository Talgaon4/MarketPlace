import React from "react";
import moonImage from "../images/moon.png";
import { Col, Row, Container, Image, Button } from "react-bootstrap";

const NotFound = () => {
  return (
    <Container fluid className="header-home pt-3 pb-5 px-3">
      <Row className="pb-5">
        <Col xs={12} sm={10}>
          <h1 className="pb-2 pb-ml-5">
            404
            <br />
            Page Not Found
          </h1>
        </Col>
        <Col sm={2}>
          <div>
            <Image
              className="moon-img align-self-center"
              src={moonImage} // Use the imported image as the source
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
