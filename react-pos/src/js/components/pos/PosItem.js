import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "../App.css";

class PosItem extends Component {
  constructor(props) {
    super(props);
		this.state = {
			allowDecreaseQuantity: true, discountOpen: false, discountType: 'fix', discountAmount: 0, totalDiscount: 0.0,
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

	discountChanged = (e) => {
		console.log("discountChanged:", e)
		this.updateDiscount(this.state.discountType, this.state.discountAmount);
	}

	updateDiscount = (type, amount) => {
		if (type == 'per') {
			this.setState({ totalDiscount: this.getTotal() * (amount / 100)}, () => {console.log("total d upd: ",this.state.totalDiscount)});
		} else {
			this.setState({ totalDiscount: amount}, () => {console.log("total d upd: ",this.state.totalDiscount)});
		}
	}

	handleClose = (e) => {
		this.setState({ discountOpen: false });
		this.props.updateDiscount(this.props.id, this.state.totalDiscount);
	};
  render() {
    const { id, name, unitPrice, quantity, quantity_on_hand, purchasePrice } = this.props;
    var itemNumber = quantity;
    return (
			<tr>
				<Modal show={this.state.discountOpen} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Enter Discount</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="form-group">
							<div>
								<select
									style={{ width: "75px" }}
									className="form-control"
									onChange={(e) => this.setState({discountType: e.target.value}, this.discountChanged)}
									value={this.state.discountType}>
									<option value="fix">Fixed</option>
  								<option value="per">Percentage %</option>
								</select>
								<input
								style={{ width: "75px" }}
								type="number"
								className="form-control"
								minLength={0}
								onChange={(e) => this.setState({discountAmount: e.target.value}, this.discountChanged)}
								value={this.state.discountAmount}
								/>
							</div>
							<div className="">
								<p style={{ fontSize: 11, color: "red" }}>Purchased on: {purchasePrice}</p>
								<p style={{ fontSize: 11, color: "green" }}>Total discount: {purchasePrice}</p>
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
          {this.getTotal()}
        </td>
        <td defaultValue="0.00" className="delete">
          <button
            className="btn btn-danger"
            onClick={() => this.handleChange(id, "delete")}
          >
            X
            <i className="glyphicon glyphicon-trash" />
					</button>
					<Button onClick={() => this.setState({ discountOpen: true })}style={{margin: 2}} variant="success">%</Button>{' '}
        </td>
      </tr>
    );
  }
}

export default PosItem;
