import React, { Component } from "react";
import "../App.css";

class PosItem extends Component {
  constructor(props) {
    super(props);
    this.state = { allowDecreaseQuantity: true };
  }
  handleChange = (id, itemNumber) => {
    debugger;
    console.log("handleChange id: ", id);
    console.log("handleChange itemNumber: ", itemNumber);
    this.props.onChange(id, itemNumber);
  };
  handleChangeQuantity = (id, e) => {
    if (
      this.props.quantity_on_hand - e.target.value > 0 &&
      e.target.value != 0
    ) {
      this.props.onChange(id, e.target.value);
    }
  };
  render() {
    const { id, name, unitPrice, quantity, quantity_on_hand } = this.props;
    var itemNumber = quantity;
    return (
      <tr>
        <td className="name" defaultValue="">
          {" "}
          {name}
        </td>
        <td className="unitPrice" defaultValue="0.00">
          {" "}
          {unitPrice}{" "}
        </td>
        <td className="quantity">
          {/* <button
            className="btn btn-sm pull-left"
            onClick={() => this.handleChange(id, --itemNumber)}
          >
            <i className="glyphicon glyphicon-minus" />
          </button> */}

          <div>
            <input
              style={{ width: "75px" }}
              type="number"
              minLength={0}
              onChange={(e) => this.handleChangeQuantity(id, e)}
              value={itemNumber}
            />
          </div>

          {/* <button
            className="btn btn-sm pull-right"
            onClick={() => this.handleChange(id, ++itemNumber)}
          >
            <i className="glyphicon glyphicon-plus" />
          </button> */}
        </td>
        <td className="quantityAvailable">{quantity_on_hand - quantity}</td>
        <td className="tax">0.00</td>
        <td defaultValue="0.00" className="col-md-2 total">
          {unitPrice * quantity}
        </td>
        <td defaultValue="0.00" className="delete">
          <button
            className="btn btn-danger"
            onClick={() => this.handleChange(id, "delete")}
          >
            Delete
            <i className="glyphicon glyphicon-trash" />
          </button>
        </td>
      </tr>
    );
  }
}

export default PosItem;
