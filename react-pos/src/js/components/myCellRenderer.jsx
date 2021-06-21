import React from "react";
import { Modal, Button } from "react-bootstrap";
import BarCode from "./BarCode/BarCode.jsx";
import { Link } from "react-router-dom";

export default (props) => {
  const cellValue = props.valueFormatted ? props.valueFormatted : props.value;

  return (
    <div>
      <Link to={{ pathname: "/barcode", state: { code: cellValue } }}>
        {cellValue}
      </Link>
    </div>
  );
};
