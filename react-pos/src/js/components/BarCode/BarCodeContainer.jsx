import React, { Component } from "react";
import "../App.css";
import bwipjs from "bwip-js";
import BarCode from "./BarCode";

class BarCodeContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {
    console.log("BarCodeContainer", this.props);

    this.props.location.state.forEach((element) => {
      // return bwipjs.toCanvas(element.barCode, {
      //   bcid: "code128", // Barcode type
      //   text: this.props.barCode, // Text to encode
      //   scale: 1, // 3x scaling factor
      //   height: 9, // Bar height, in millimeters
      //   includetext: true, // Show human-readable text
      //   textxalign: "center", // Always good to set this
      // });
      console.log("item: ", element.barCode);
    });
  }

  render() {
    const items = this.props.location.state;
    return items.map((item) => {
      <div>
        <p>{item.name}</p>
        {/* <canvas style={{ marginTop: 5 }} id={item.barCode}></canvas>; */}
      </div>;
    });
  }
}

export default BarCodeContainer;
