import React, { Component } from "react";
import "../App.css";
import BarCode from "./BarCode";

class BarCodeContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidMount() {
    //console.log("BarCodeContainer", this.props);
  }

  getReduced() {
    return this.props.location.state.reduce(function (
      result,
      value,
      index,
      array
    ) {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    },
    []);
  }

  render() {
    console.log("items before", this.props.location.state);
    const items = this.props.location.state;
    console.log("items00", items);
    return (
      <div style={{ margin: 10, padding: 20, width: '800'}}>
        {items.map((item, i) => (
          <BarCode item={item} />
        ))}
      </div>
    );
  }
}

export default BarCodeContainer;
