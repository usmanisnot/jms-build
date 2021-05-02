import React, { Component } from "react";
import "./App.css";
import Header from "./Header";
import CompleteTransactions from "./CompleteTransactions";
import axios from "axios";
import moment from "moment";

const HOST = "http://localhost:8001";
const url = HOST + `/api/all`;

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = { transactions: [] };
  }
  componentWillMount() {
    axios
      .get(url)
      .then((response) => {
        let data = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        this.setState({ transactions: data }, () =>
          console.log("got state: ", this.state)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    var { transactions } = this.state;

    var rendertransactions = () => {
      if (transactions.length === 0) {
        return <p>No Transactions found</p>;
      } else {
        return transactions.map((transaction, i) => (
          <CompleteTransactions key={i} {...transaction} {...this.props} />
        ));
      }
    };

    return (
      <div>
        <Header />

        <table className=" table-striped fixed_header">
          <thead>
            <tr>
              <th className="time">Time</th>
              <th className="total">Total</th>
              <th className="products">Products</th>
              <th className="open"></th>
            </tr>
          </thead>
          <tbody>{rendertransactions()}</tbody>
        </table>
      </div>
    );
  }
}

export default Transactions;
