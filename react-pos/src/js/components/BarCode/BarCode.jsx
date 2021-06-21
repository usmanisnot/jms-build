import React, { Component } from "react";
import "../App.css";
import { useBarcode } from 'react-barcodes';

function BarCode(props) {
  const barCode = props.item.barCode;
    const altText = (props.item.name != undefined && props.item.name != null ? props.item.name : '')
                    + " Rs: " + parseFloat(props.item.listedPrice).toFixed(2);
    const { inputRef } = useBarcode({
        value: barCode,
        options:{
          text: altText,
          displayValue: true,
          fontSize: 18
        }
      });

  return <svg style={{ marginTop: 5 }} id={barCode} ref={inputRef} />;
};

export default BarCode;
