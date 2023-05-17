import React from "react";

function Header({ title }) {
  return (
    <div className="header-container py-4">
      <h1>{title}</h1>
    </div>
  );
}

export default Header;
