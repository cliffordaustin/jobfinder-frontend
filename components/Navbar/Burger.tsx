import React from "react";

function Burger() {
  return (
    <div className="z-40">
      <input id="nav-toggle" type="checkbox" className="navigation-checkbox" />
      <label htmlFor="nav-toggle" className="navigation-icon">
        <div className="burger"></div>
      </label>
    </div>
  );
}

export default Burger;
