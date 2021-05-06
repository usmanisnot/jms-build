import React from "react";
import { Link } from "react-router-dom";

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  <div className="text-center">
    <div style={{ backgroundColor: "#ee3837" }}>
      <h2 style={{ color: "white" }}>Yousaf Traders</h2>
    </div>

    <ul className="nav-menu">
      <li className="lead">
        <Link to="/inventory">Inventory</Link>
      </li>
      <li className="lead">
        <Link to="/">New Order</Link>
      </li>
      <li className="lead">
        <Link to="/transactions">Orders</Link>
      </li>
      <li style={{ display: "none" }} className="lead">
        <Link to="/livecart">LiveCart</Link>
      </li>
      <li style={{ display: "none" }} className="lead">
        <Link to="/receipt">Slip</Link>
      </li>
    </ul>
  </div>
);

export default Header;
