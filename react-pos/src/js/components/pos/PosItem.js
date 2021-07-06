import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "../App.css";

class PosItem extends Component {
  constructor(props) {
    super(props);
		this.state = {
			allowDecreaseQuantity: true, discountOpen: false,
		};
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

	getTotal = () => {
		return this.props.unitPrice * this.props.quantity;
	}

	handleClose = (e) => {
		this.setState({ discountOpen: false });
	};

	updateDiscountAmount = (e) => {
		this.props.updateDiscount(this.props.id, e.target.value);
	}

  render() {
    const { id, name, unitPrice, quantity, quantity_on_hand, purchasePrice, discount, lineTotal, totalDiscount } = this.props;
    var itemNumber = quantity;
    return (
			<tr>
				<Modal show={this.state.discountOpen} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Enter Discount</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="form-group">
							<input
								type="number"
								className="form-control"
									minLength={0}
								onChange={this.updateDiscountAmount}
								value={discount}
								/>
							<div className="">
								<p style={{ fontSize: 11, color: "red", marginTop: 20 }}>Purchased on: <b>{purchasePrice}</b></p>
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
						</Button>
						<Button variant="primary" onClick={this.handleClose}>
							Save Changes
						</Button>
					</Modal.Footer>
				</Modal>
        <td className="name" defaultValue="">
          {" "}
          {name}
        </td>
        <td className="unitPrice" defaultValue="0.00">
          {" "}
          {unitPrice}{" "}
        </td>
        <td className="quantity">
          <div>
            <input
              style={{ width: "75px" }}
              type="number"
              minLength={0}
              onChange={(e) => this.handleChangeQuantity(id, e)}
              value={itemNumber}
            />
          </div>
        </td>
        <td className="quantityAvailable">{quantity_on_hand - quantity}</td>
        <td className="tax">0.00</td>
        <td defaultValue="0.00" className="col-md-2 total">
					<div>Total: {lineTotal}</div>
					{totalDiscount > 0 && <div>Discouted: {lineTotal - totalDiscount}</div>}
				</td>
				<td defaultValue="0.00" className="delete">
					<div>
						<button
							className="btn btn-danger"
							onClick={() => this.handleChange(id, "delete")}
						>
							X
						</button>
					</div>
					<Button onClick={() => this.setState({ discountOpen: true })}style={{marginTop: 2}} variant="success">%</Button>{' '}
        </td>
      </tr>
    );
  }
}

export default PosItem;
