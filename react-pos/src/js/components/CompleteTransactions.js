import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import "./App.css";
import TransactionDetail from "./TransactionDetail";
import Moment from "react-moment";

class CompleteTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionModal: false,
      totalquantity: 0,
      items: [],
    };
  }

  render() {
    var { date, total, items, totalPayment, customer } = this.props;
    var renderQuantity = (items) => {
      var totalquantity = 0;
      for (var i = 0; i < items.length; i++) {
        totalquantity =
          parseInt(totalquantity, 10) + parseInt(items[i].quantity, 10);
      }

      return totalquantity;
    };
    var renderItemDetails = (items) => {
      return items.map((item, i) => <TransactionDetail key={i} {...item} />);
    };

    return (
      <tr>
        <td className="time">
          {" "}
          <Moment local format="HH:MM A @ D MMM YYYY">
            {date}
          </Moment>
        </td>
        <td className="total"> {total} </td>
        <td className="products"> {renderQuantity(items)} </td>
        <td className="open">
          <a
            className="btn btn-info"
            onClick={() => this.setState({ transactionModal: true })}
          >
            Details
            <i className="glyphicon glyphicon-new-window" />
          </a>
        </td>

        <Modal show={this.state.transactionModal} size="lg">
          <Modal.Header>
            <Modal.Title>Transaction Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="panel panel-primary">
              <div className="panel-heading  lead">
                <Moment local format="D MMM YYYY">
                  {date}
                </Moment>
              </div>
              <div style={{ fontStyle: "italic" }}>
                <Moment local format="HH:MM A ">
                  {date}
                </Moment>
              </div>
              <h5>Customer Name: {customer ? customer.name : ""} </h5>
              <table className="receipt table table-hover">
                <thead>
                  <tr className="small">
                    <th> Quantity </th>
                    <th> Product </th>
                    <th> Price </th>
                  </tr>
                </thead>
                {renderItemDetails(items)}
                <tbody>
                  <tr className="total">
                    <td />
                    <td>Total</td>
                    <td> Rs{total} </td>
                  </tr>
                  <tr>
                    <td />
                    <td>Total Payment</td>
                    <td> Rs{totalPayment} </td>
                  </tr>
                  <tr className="lead">
                    <td />
                    <td>Change</td>
                    <td> Rs{totalPayment - total} </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ transactionModal: false })}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </tr>
    );
  }
}

export default CompleteTransactions;
