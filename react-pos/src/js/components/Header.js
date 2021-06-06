import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  // <div className="text-center">
  //   <div>
  //     <h2 style={{ color: "white" }}>Yousaf Traders</h2>
  //   </div>

  //   <ul className="nav-menu">
  //     <li className="lead">
  //       <Link className="anchorTag" to="/inventory">
  //         Inventory
  //       </Link>
  //     </li>
  //     <li className="lead">
  //       <Link className="anchorTag" to="/">
  //         New Order
  //       </Link>
  //     </li>
  //     <li className="lead">
  //       <Link className="anchorTag" to="/transactions">
  //         Orders
  //       </Link>
  //     </li>
  //     <li style={{ display: "none" }} className="lead">
  //       <Link to="/livecart">LiveCart</Link>
  //     </li>
  //     <li style={{ display: "none" }} className="lead">
  //       <Link to="/receipt">Slip</Link>
  //     </li>
  //   </ul>
  // </div>

  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Navbar.Brand href="#home">
      <h2 style={{ color: "white" }}>Victress Store</h2>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/inventory">Inventory</Nav.Link>
        <Nav.Link href="/">New Order</Nav.Link>
        <Nav.Link href="/transactions">Orders</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
