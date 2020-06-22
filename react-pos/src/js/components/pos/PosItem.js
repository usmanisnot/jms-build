import React, { Component } from "react";
import "../App.css";

class PosItem extends Component {
  constructor(props){
    super(props)
    this.state = {allowDecreaseQuantity: true};
  }
  handleChange = (id, itemNumber) => {
    if(itemNumber >=1 ){
      this.props.onChange(id, itemNumber);
    }
  };
  handleChangeQuantity = (id, e) => {
    this.props.onChange(id, e.target.value);
  };
  render() {
    const { id, name, price, quantity } = this.props;
    var itemNumber = quantity;
    return (
      <tr>
        <td defaultValue="" className="col-md-4"> {name}</td>
        <td defaultValue="0.00" className="col-md-2"> {price} </td>
        <td className="col-md-2">
        
        <button
          className="btn btn-sm pull-left"
          onClick={() => this.handleChange(id, --itemNumber)}
        >
          <i className="glyphicon glyphicon-minus" />
        </button>

          <div className="col-md-6">
            <input type="number" minLength="0" onChange={(e) => this.handleChangeQuantity(id, e)} value={itemNumber} />
          </div>

          <button
            className="btn btn-sm pull-right"
            onClick={() => this.handleChange(id, ++itemNumber)}
          >
            <i className="glyphicon glyphicon-plus" />
          </button>
        </td>
        <td className="col-md-1">0.00</td>
        <td defaultValue="0.00" className="col-md-1">{price}</td>
        <td className="col-md-1">
          <button
            className="btn btn-danger"
            onClick={() => this.handleChange(id, "delete")}
          >
            <i className="glyphicon glyphicon-trash" />
          </button>
        </td>
      </tr>
    );
  }
}

export default PosItem;
