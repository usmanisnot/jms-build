import React, { Component } from "react";
import "../App.css";
import "./select.css";

import "react-select/dist/react-select.css";
import "react-virtualized-select/styles.css";
import Select from "react-virtualized-select";

class ProductsDropdown extends Component {
  constructor(props){
    super(props)
    console.log("props: ", props);
    let data = this.mapOnSelectData(props.groupedOptions)
    this.state = {options: data, selectValue: {}}
    console.log("this.state: ", this.state);
  }
  mapOnSelectData = (arr) => {
    let result = []
    arr.forEach(element => {
      result.push({
        label: element.name,
        value: element._id 
      })
    });
    return result
  }
  onChangehandler = (selectValue) => {
    this.setState({ selectValue }, ()=>console.log("state updated: ", this.state))
    this.props.onProductSelect(selectValue);
  }
  render() {
    return (
      <Select
            options={this.state.options}
            onChange={this.onChangehandler}
            value={this.state.selectValue}
            place
          />
    );
  }
}

export default ProductsDropdown;
