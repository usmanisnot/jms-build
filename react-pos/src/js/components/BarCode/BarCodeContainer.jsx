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
    const items = this.getReduced();
    console.log("items00", items);
    return (
      <table style={{ borderSpacing: 13, borderCollapse: "separate" }}>
        <tbody>
          {items.map((TwoItems, i) => (
            <tr key={i}>
              {TwoItems.map((item, j) => (
                <td
                  style={{
                    margin: 30,
                    border: "1px solid red",
                  }}
                  key={i * j}
                >
                  <BarCode item={item} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default BarCodeContainer;
