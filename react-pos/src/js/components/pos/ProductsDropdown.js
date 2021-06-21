import React, { Component } from "react";
import "../App.css";
//import "./select.css";
//import "./searchBar.css";

// import "react-select/dist/react-select.css";
// import "react-virtualized-select/styles.css";
import Select from "react-select";
import axios from "axios";

const HOST = "http://localhost:8001";

const customStyles = {
  option: (styles, { isDisabled }) => {
    return {
      ...styles,
      backgroundColor: isDisabled ? "#ee3837" : "white",
      color: "#000",
      cursor: isDisabled ? "not-allowed" : "default",
    };
  },
};

class ProductsDropdown extends Component {
  constructor(props) {
    super(props);
    console.log("props: ", props);
    this.state = { options: [], selectValue: {} };
    console.log("this.state: ", this.state);
    //this.selectRef = React.createRef();
  }
  mapOnSelectData = (arr) => {
    let result = [];
    arr.forEach((element) => {
      result.push({
        label: element.barCode + " - " + element.name,
        value: element._id,
        price: element.price,
        quantity: element.quantity,
        isDisabled: element.quantity < 1,
      });
    });
    return result;
  };
  componentWillMount() {
    var url = HOST + `/api/inventory/all`;
    axios.get(url).then((response) => {
      console.log("re: ",response)
      let data = this.mapOnSelectData(response.data);
      this.setState({ options: data }, () => {
        console.log("state updated: ", response);
      });
    });
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  componentDidMount() {}

  onChangehandler = (selectValue) => {
    this.setState({ selectValue });
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
        styles={customStyles}
      />
    );
  }
}

export default ProductsDropdown;
