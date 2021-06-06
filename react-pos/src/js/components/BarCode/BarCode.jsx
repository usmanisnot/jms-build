import React, { Component } from "react";
import "../App.css";
import bwipjs from "bwip-js";

class BarCode extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {
    var barCode = this.props.location
      ? this.props.location.state.code
      : this.props.barCode;
    return bwipjs.toCanvas(barCode, {
      bcid: "code128", // Barcode type
      text: barCode, // Text to encode
      scale: 3, // 3x scaling factor
      height: 9, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      textxalign: "center", // Always good to set this
    });
  }
  render() {
    const barCode = this.props.location
      ? this.props.location.state.code
      : this.props.barCode;
    return <canvas style={{ marginTop: 5 }} id={barCode}></canvas>;
  }
}

export default BarCode;
