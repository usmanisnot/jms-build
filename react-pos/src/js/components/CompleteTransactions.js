import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import "./App.css";
import TransactionDetail from "./TransactionDetail";
import Moment from "react-moment";
import axios from "axios";

const HOST = "http://localhost:8001";

class CompleteTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionModal: false,
      totalquantity: 0,
      items: [],
    };
  }

  getTransaction() {
    return {
      date: this.props.date,
      total: this.props.total,
      items: this.props.items,
      totalPayment: this.props.totalPayment,
      customer: this.props.customer,
    };
  }

  delete = () => {
    if (window.confirm("Delete the item?")) {
      axios
        .delete(HOST + "/api/" + this.props._id)
        .then(this.deleteSuccess)
        .catch((err) => {
          console.log(err);
        });
    }
  };
  deleteSuccess = (response) => {
    this.props.deleteSuccess();
  };

  render() {
    var { date, total, items, totalPayment, customer, isDisplay } = this.props;
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
      isDisplay && (
        <tr>
          <td className="name">{customer ? customer.name : ""}</td>
          <td className="time">
            {" "}
            <Moment local format="HH:MM A @ D MMM YYYY">
              {date}
            </Moment>
          </td>
          <td className="total"> {total} </td>
          <td className="balance"> {totalPayment - total} </td>
          <td className="products"> {renderQuantity(items)} </td>
          <td className="open">
            <a
              className="btn btn-info hidden"
              onClick={() => this.setState({ transactionModal: true })}
            >
              Details
              <i className="glyphicon glyphicon-new-window" />
            </a>

            <button
              className="btn btn-primary"
              onClick={() =>
                this.props.history.push("/receipt", this.getTransaction())
              }
            >
              View Details
            </button>
            <button
              className="btn btn-danger btn-xs"
              style={{ margin: 10 }}
              onClick={() => this.delete()}
            >
              X
            </button>
          </td>
        </tr>
      )
    );
  }
}

export default CompleteTransactions;
