import React, { Component } from "react";
import "./App.css";
import Header from "./Header";
import CompleteTransactions from "./CompleteTransactions";
import axios from "axios";
import moment from "moment";
import Select from "react-select";

const HOST = "http://localhost:8001";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = { transactions: [], customers: [] };
  }

  componentDidMount = () => {
    this.setTransactions();
    this.setCustomers();
  };

  deleteSuccess = () => {
    this.setTransactions();
  };
  setTransactions = () => {
    var url = HOST + `/api/all`;
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
  };
  setCustomers = () => {
    var url = HOST + `/api/customers/all`;
    axios.get(url).then((response) => {
      this.setState({ customers: response.data });
    });
  };
  getSearchableCustomers = () => {
    return this.state.customers.map((item) => {
      return { label: item.name, value: item.phone };
    });
  };
  handleSelectCustomer = (option) => {};
  render() {
    var { transactions } = this.state;

    var rendertransactions = () => {
      if (transactions.length === 0) {
        return <p>No Transactions found</p>;
      } else {
        return transactions.map((transaction, i) => (
          <CompleteTransactions
            key={i}
            {...transaction}
            {...this.props}
            deleteSuccess={this.deleteSuccess}
          />
        ));
      }
    };

    return (
      <div>
        <Header />

        <table className=" table-striped fixed_header">
          <thead>
            <tr>
              <th className="time">
                <Select
                  options={this.getSearchableCustomers()}
                  onChange={this.handleSelectCustomer}
                />
              </th>
              <th className="total">Total</th>
              <th className="balance">Balance</th>
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
