import React, { Component } from "react";
import "../App.css";
//import "./select.css";
import "./searchBar.css";

import "react-select/dist/react-select.css";
import "react-virtualized-select/styles.css";
import Select from "react-virtualized-select";
import axios from "axios";


const HOST = "http://localhost:8001";

class ProductsDropdown extends Component {
  constructor(props){
    super(props)
    console.log("props: ", props);
    this.state = {options: [], selectValue: {}}
    console.log("this.state: ", this.state);
  }
  mapOnSelectData = (arr) => {
    let result = []
    arr.forEach(element => {
      result.push({
        label: element.name,
        value: element._id,
        price: element.price,
        quantity: element.quantity 
      })
    });
    return result
  }
  componentWillMount() {
    var url = HOST + `/api/inventory/products`;
    axios.get(url).then(response => {
      let data = this.mapOnSelectData(response.data)
      this.setState({ options: data }, ()=>{console.log("state updated: ", response)});
    });
  }
  onChangehandler = (selectValue) => {
    this.setState({ selectValue }, ()=>console.log("state updated: ", this.state))
    this.props.onProductSelect(selectValue);
  }
  render() {
    return (
      <div className="s003">
            <form>
            <div className="inner-form">
                <div className="input-field second-wrap">
                <Select
                  options={this.state.options}
                  onChange={this.onChangehandler}
                  value={this.state.selectValue}
                  id="search"
                  placeholder= "Search..."
                  className="selectComponenet"
                  />
                </div>
            </div>
            </form>
        </div>
    );
  }
}

export default ProductsDropdown;
