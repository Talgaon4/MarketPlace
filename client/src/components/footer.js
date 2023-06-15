import React from "react";
import Image from "react-bootstrap/Image";
import linkdinIcon from "../images/linkedin-black.png";
import githubIcon from "../images/github-icon.png";
import astro from "../images/astronaut-computer.png";
export const Footer = () => {
  return (
    <footer className="footer text-center text-white">
      <div className="container p-4 pb-0">
        <section className="mb-4 d-flex justify-content-center">
          <a className=" m-1" href="httpss://www.linkedin.com/in/yovel-gabbay/">
            <div className="icon-circle icon-1">
              <Image
                width={28}
                src={linkdinIcon} // Use the imported image as the source
              />
            </div>
          </a>
          <a
            className=" m-1"
            href="httpss://www.linkedin.com/in/tal-gaon-352176236/"
          >
            <div className="icon-circle icon-2">
              <Image
                width={28}
                src={linkdinIcon} // Use the imported image as the source
              />
            </div>
          </a>
          <a className=" m-1" href="httpss://github.com/Yovelgabay/MarketPlace">
            <div className="icon-circle icon-3">
              <Image
                width={28}
                src={githubIcon} // Use the imported image as the source
              />
            </div>
          </a>
        </section>
      </div>

      <div
        className="text-center p-3 d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        © {new Date().getFullYear()} Gaming Space
        <Image
          className="align-self-center mx-3"
          width={50}
          rounded
          src={astro}
        />
      </div>
    </footer>
  );
};
