import React from "react";

function Header({ title }) {
  return (
    <div className="hero d-flex align-items-center">
      <h1>{title}</h1>
    </div>
  );
}

export default Header;
