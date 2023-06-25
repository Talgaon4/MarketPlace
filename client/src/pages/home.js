import React from "react";
import astronautImage from "../images/astronaut.png";
import { Col, Row, Container, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <Container fluid className="header-home pt-3 pb-5 px-3">
      <Row className="pb-5">
        <Col xs={12} sm={10}>
          <h1 className="pb-2 pb-ml-5">
            Welcome to
            <br />
            <span className="glow">Gaming Space</span>
          </h1>
          <p className="pt-2 pb-5">
            <span>Discover</span> and <span>explore</span> a wide range of
            gaming products on our platform. <br />
            Save your favorite items, and even unleash your creativity by
            selling <span>your own gaming treasures</span>.
            <br />
            Gaming Space is your go-to <span>Gaming Marketplace!</span>
            <br />
            Get ready to level up your gaming experience with{" "}
            <span>Gaming Space</span>, where the world of gaming awaits you!
          </p>
          <div>
            <Button
              className="btn2 btn-home px-4"
              size="lg"
              as={Link}
              to="/create-item"
            >
              Sell your products!
            </Button>{" "}
          </div>
        </Col>
        <Col sm={2}>
          <div className="astro">
            <Image
              className="astro-img align-self-center"
              src={astronautImage} // Use the imported image as the source
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};
