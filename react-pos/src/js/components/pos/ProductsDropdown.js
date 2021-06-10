import React, { Component } from "react";
import "../App.css";
//import "./select.css";
import "./searchBar.css";

// import "react-select/dist/react-select.css";
// import "react-virtualized-select/styles.css";
import Select from "react-select";
import axios from "axios";

const HOST = "http://localhost:8001";

// const customStyles = {
//   option: (styles, { isDisabled }) => {
//     return {
//       ...styles,
//       backgroundColor: isDisabled ? "#ee3837" : "white",
//       color: "#000",
//       cursor: isDisabled ? "not-allowed" : "default",
//     };
//   },
// };

class ProductsDropdown extends Component {
  constructor(props) {
    super(props);
    this.barcodeInput = React.createRef();
    console.log("props: ", props);
    this.state = { options: [], selectValue: {} };
    console.log("this.state: ", this.state);
    //this.selectRef = React.createRef();
  }
  mapOnSelectData = (arr) => {
    console.log("arra: ", arr);
    let result = [];
    arr.forEach((element) => {
      result.push({
        label:
          (element.barCode == undefined ? "" : element.barCode) +
          " - " +
          (element.code == undefined ? "" : element.code) +
          " - " +
          element.name,
        value: element._id,
        price: parseFloat(element.price == undefined ? "0.00" : element.price),
        quantity: parseInt(
          element.quantity == undefined ? "0.00" : element.quantity
        ),
      });
    });
    console.log("result: ", result);
    return result;
  };
  componentWillMount() {
    var url = HOST + `/api/inventory/products`;
    axios.get(url).then((response) => {
      let data = this.mapOnSelectData(response.data);
      this.setState({ options: data }, () => {
        console.log("state updated: ", response);
      });
    });
  }

  componentDidMount() {
    this.barcodeInput.current.focus();
  }

  onChangehandler = (selectValue) => {
    this.setState({ selectValue });
    console.log("selectValue", selectValue);
    this.props.onProductSelect(selectValue);
  };

  keyPressed(event) {
    if (event.key === "Enter") {
    }
  }

  render() {
    return (
      <Select
        options={this.state.options}
        onChange={this.onChangehandler}
        value={this.state.selectValue}
        id="search"
        placeholder="Search..."
        className="selectComponenet"
        onKeyPress={this.keyPressed}
        ref={this.barcodeInput}
      />
    );
  }
}

export default ProductsDropdown;
