import React, { Component } from "react";
import "../App.css";
import bwipjs from "bwip-js";

class BarCode extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {
    console.log("this props:", this.props);
    return bwipjs.toCanvas("myCanvas", {
      bcid: "code128", // Barcode type
      text: this.props.location.state.code, // Text to encode
      scale: 1, // 3x scaling factor
      height: 9, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      textxalign: "center", // Always good to set this
    });
  }

  render() {
    return <canvas style={{ marginTop: 5 }} id="myCanvas"></canvas>;
  }
}

export default BarCode;
