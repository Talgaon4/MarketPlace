import React from "react";
import astronautImage from "../images/astronaut.png";
import { Col, Row, Container, Image, Button } from "react-bootstrap";

export const Home = () => {
  return (
    <Container fluid className="header-home pt-3 pb-5 px-3">
      <Row className="pb-5">
        <Col>
          <h1 className="pb-5">
            Welcome to
            <br />
            <span className="glow">Gaming Space</span>
          </h1>
          <p className="pt-2 pb-5">
            <span>Discover</span> and <span>explore</span> a wide range of
            gaiming products on our platform. <br />
            Save your favorite items, and even unleash your creativity by
            selling <span>your own gaming treasures</span>.
            <br />
            MarketHub is your go-to <span>Gaming Marketplace!</span>
            <br />
            Get ready to level up your gaming experience with{" "}
            <span>MarketHub</span>, where the world of gaming awaits you!
          </p>
          <div>
            <Button>Sell your products!</Button>{" "}
            <Button className="btn2">Explore community products</Button>
          </div>
        </Col>
        <Col md="auto">
          <div className="astro">
            <Image
              rounded
              src={astronautImage} // Use the imported image as the source
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};
