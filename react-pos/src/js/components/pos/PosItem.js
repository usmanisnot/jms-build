import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import "../App.css";

class PosItem extends Component {
  constructor(props) {
    super(props);
		this.state = {
			allowDecreaseQuantity: true, discountOpen: false, afterDiscount: 0.0, discountedAmount: 0.0,
		};
  }
  handleChange = (id, itemNumber) => {
    debugger;
    console.log("handleChange id: ", id);
    console.log("handleChange itemNumber: ", itemNumber);
    this.props.onChange(id, itemNumber);
  };
  handleChangeQuantity = (id, e) => {
    console.log("handleChangeQuantity id: ", id);
    console.log("handleChangeQuantity val: ", e.target.value);
    this.props.onChange(id, e.target.value);
    // if (
    //   this.props.quantity_on_hand - e.target.value > 0
    // ) {
      
    // }
	};

	getTotal = () => {
		return this.props.unitPrice * this.props.quantity;
  }
  
  getPercentage = () => {
    return (this.props.discount / this.props.unitPrice) * 100 || undefined;
  }

	handleClose = (e) => {
		this.setState({ discountOpen: false });
	};

  updateDiscountAmount = (e) => {
    let percentedAmount = this.props.unitPrice * (e.target.value / 100);
    this.props.updateDiscount(this.props.id, percentedAmount);
    this.setState({afterDiscount: this.props.unitPrice - percentedAmount, discountedAmount: percentedAmount});
	}

  render() {
    const { id, name, unitPrice, quantity, quantity_on_hand, purchasePrice, discount, lineTotal, totalDiscount } = this.props;
    return (
			<tr>
				<Modal show={this.state.discountOpen} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Enter Discount (%)</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="form-group">
							<input
								type="number"
								className="form-control"
								onChange={this.updateDiscountAmount}
								value={this.getPercentage()}
								/>
							<div className="">
                <p style={{ fontSize: 11, color: "red", marginTop: 20 }}>Purchasing price: <b>{purchasePrice}</b></p>
                <p style={{ fontSize: 18, color: "green", marginTop: 20 }}>Discounted Price: <b>{this.state.afterDiscount}</b></p>
              </div>
              <div className="">
                <p style={{ fontSize: 17, color: "blue", marginTop: 20 }}>Discounted Amount: <b>{this.state.discountedAmount}</b></p>
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
              value={quantity}
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
