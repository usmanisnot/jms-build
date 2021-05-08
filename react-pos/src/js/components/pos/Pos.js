import React, { Component } from "react";
import "../App.css";
import Header from "../Header";
import io from "socket.io-client";
import axios from "axios";
import moment from "moment";
import { Table, Modal, Button, Form, Col, Row } from "react-bootstrap";
import PosItem from "./PosItem";
import ProductsDropdown from "./ProductsDropdown";
import SearchBar from "./searchBar";
import Checkout from "../Checkout";
import Creatable, { makeCreatableSelect } from "react-select/creatable";

const HOST = "http://localhost:8001";
let socket = io.connect(HOST);

class Pos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      selectedProduct: {},
      addItemModal: false,
      amountDueModal: false,
      totalPayment: 0,
      total: 0,
      changeDue: 0,
      products: [],
      currentItem: {
        id: "",
        name: "",
        price: 0,
        unitPrice: 0,
        quantity: 1,
        quantity_on_hand: 0,
      },
      customer: { name: "", address: "", phone: "" },
      customers: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleProductAdd = this.handleProductAdd.bind(this);
  }

  componentDidMount() {
    this.setProducts();
    this.setCustomers();
  }

  setProducts = () => {
    var url = HOST + `/api/inventory/products`;
    axios.get(url).then((response) => {
      this.setState({ products: response.data });
    });
  };

  setCustomers = () => {
    var url = HOST + `/api/customers/all`;
    axios.get(url).then((response) => {
      this.setState({ customers: response.data });
    });
  };

  componentDidUpdate() {
    if (this.state.items.length !== 0) {
      socket.emit("update-live-cart", this.state.items);
    }
  }

  handleSubmit = (e) => {
    this.setState({ addItemModal: false });

    const currentItem = {
      id: this.state.id,
      name: this.state.name,
      unitPrice: this.state.unitPrice,
      quantity: this.state.quantity,
    };
    this.addItem(currentItem);
    this.updateTotal();
  };
  addItem = (item) => {
    var items = this.state.items;
    var foundItemIndex = items.findIndex((i) => i.id == item.id);
    if (foundItemIndex >= 0) {
      if (items[foundItemIndex] != null && items[foundItemIndex] != undefined) {
        items[foundItemIndex].quantity++;
        items[foundItemIndex].quantity_on_hand--;
      }
    } else {
      items.push(item);
    }
    this.setState({ items: items });
  };

  selectCustomer = (customer) => {
    this.setState({ customer: customer }, () => {
      console.log("selected customer: ", this.state);
    });
  };

  handleCustomerName = (e) => {
    var updatedCustomer = { ...this.state.customer };
    updatedCustomer.name = e.target.value;
    this.setState({ customer: updatedCustomer });
  };

  handleCustomerAddress = (e) => {
    var updatedCustomer = { ...this.state.customer };
    updatedCustomer.address = e.target.value;
    this.setState({ customer: updatedCustomer });
  };

  handleCustomerPhone = (e) => {
    var updatedCustomer = { ...this.state.customer };
    updatedCustomer.phone = e.target.value;
    this.setState({ customer: updatedCustomer });
  };

  handleName = (e) => {
    this.setState({ name: e.target.value });
  };
  handlePrice = (e) => {
    this.setState({ price: e.target.value });
  };
  handleQuantity = (e) => {
    this.setState({ price: this.state.unitPrice * e.target.value });
  };
  handlePayment = () => {
    this.updateTotal();
    var amountDiff =
      parseInt(this.state.total, 10) - parseInt(this.state.totalPayment, 10);
    this.setState({ changeDue: amountDiff, receiptModal: true, items: [] });
    this.handleSaveToDB();
    socket.emit("update-live-cart", []);
    if (this.state.total <= this.state.totalPayment) {
    } else {
      this.setState({ changeDue: amountDiff });
      //this.setState({ amountDueModal: true });
    }
  };
  handleChange = (id, value) => {
    var items = this.state.items;
    if (value === "delete") {
      var newitems = items.filter(function (item) {
        return item.id !== id;
      });
      this.setState({ items: newitems });
    } else {
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          items[i].quantity = value;
          items[i].quantity_on_hand = items[i].quantity_on_hand - 1;
          this.setState({ items: items });
        }
      }
    }
    this.updateTotal();
  };

  updateTotal = () => {
    var items = this.state.items;
    var totalCost = 0;
    for (var i = 0; i < items.length; i++) {
      var price = items[i].unitPrice * items[i].quantity;
      totalCost = parseInt(totalCost, 10) + parseInt(price, 10);
    }
    this.setState({ total: totalCost });
  };

  getSubmitableItems = () => {
    return this.state.items.map(function (item) {
      delete item.quantity_on_hand;
      return item;
    });
  };

  getCurrentTransaction = () => {
    return {
      date: moment().format("DD-MMM-YYYY HH:mm:ss"),
      total: this.state.total,
      totalPayment: this.state.totalPayment,
      items: this.getSubmitableItems(),
      customer: this.state.customer,
    };
  };

  handleSaveToDB = () => {
    const transaction = this.getCurrentTransaction();
    axios
      .post(HOST + "/api/new", transaction)
      .then(this.successSaveToDb)
      .catch((err) => {
        console.log(err);
      });
  };
  successSaveToDb = (response) => {
    this.props.history.push("/receipt", this.getCurrentTransaction());
  };
  handleProductSelect = (item) => {
    if (item != undefined && item != null) {
      let selectedProduct = this.state.products.find(function (prod) {
        return prod._id == item.value;
      });
      this.handleProductAdd(selectedProduct);
      //this.setState({selectedProduct: selectedProduct, unitPrice: selectedProduct.price}, ()=> console.log("updated state: ", this.state))
    }
  };

  handleProductAdd = (selectedProduct) => {
    const currentItem = {
      id: "_billableItem_" + selectedProduct._id,
      name: selectedProduct.name,
      unitPrice: selectedProduct.price,
      quantity: 1,
      quantity_on_hand: selectedProduct.quantity - 1,
      barCode: selectedProduct.barCode,
    };
    this.addItem(currentItem);
    this.updateTotal();
  };

  getSearchableCustomers = () => {
    return this.state.customers.map((item) => {
      return { label: item.name, value: item.phone };
    });
  };

  handleEditableSelectChange = (option) => {
    var selectedData = this.state.customers[
      this.state.customers
        .map(function (item) {
          return item.phone;
        })
        .indexOf(option.value)
    ];
    console.log("found customer:", selectedData);
    if (selectedData == undefined || selectedData == null) {
      selectedData = { name: option.label, address: "", phone: "" };
    }
    this.selectCustomer(selectedData);
  };

  render() {
    var { quantity, modal, items } = this.state;
    var data = this.getSearchableCustomers();
    var selectedOption = { id: "", name: "" };
    var renderLivePos = () => {
      if (items.length === 0) {
        return (
          <tr>
            <td className="name" defaultValue="">
              No products added
            </td>
            <td className="unitPrice" defaultValue="">
              {" "}
            </td>
            <td className="quantity"></td>
            <td className="quantityAvailable"></td>
            <td className="tax"></td>
            <td defaultValue="" className="col-md-2 total"></td>
            <td defaultValue="" className="delete"></td>
          </tr>
        );
      } else {
        return items.map((item) => (
          <PosItem key={item.id} {...item} onChange={this.handleChange} />
        ));
      }
    };

    return (
      <div>
        <Header />

        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridCustomerName">
              <Form.Label>Customer Name</Form.Label>
              <Creatable
                options={data}
                onChange={this.handleEditableSelectChange}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Address</Form.Label>
              <Form.Control
                placeholder="Address"
                onChange={this.handleCustomerAddress}
                value={this.state.customer.address}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} id="formGridProduct">
              <Form.Label>Select Product</Form.Label>
              <ProductsDropdown onProductSelect={this.handleProductSelect} />
            </Form.Group>
            <Form.Group as={Col} controlId="formGridCustomerPhone">
              <Form.Label>Customer Phone</Form.Label>
              <Form.Control
                onChange={this.handleCustomerPhone}
                value={this.state.customer.phone}
                placeholder="Customer's Phone"
              />
            </Form.Group>
          </Form.Row>

          <br />

          <Form.Group id="formGridProduct">
            <div className="">
              <div className="">
                <table className="table-striped fixed_header_pos">
                  <thead>
                    <tr>
                      <td colSpan="6" className="text-center"></td>
                    </tr>
                    <tr className="titles">
                      <th className="name">Name</th>
                      <th className="unitPrice">Unit Price</th>
                      <th className="quantity">Quantity</th>
                      <th className="quantityAvailable">Quantity available</th>
                      <th className="tax">Tax</th>
                      <th className="total">Total</th>
                      <th className="delete"></th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>{renderLivePos()}</tbody>
                  <tfoot className="tableFoot">
                    <tr>
                      <td colSpan={3}>
                        <span className="checkout-total-price">Total Bill</span>
                      </td>
                      <td colSpan={4}>
                        <span
                          style={{ float: "right" }}
                          className="checkout-total-price"
                        >
                          {this.state.total}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </Form.Group>

          <Form.Row>
            <Form.Group>
              <Form.Label className="checkout-total-price">
                Total paid:
              </Form.Label>
              <Form.Control
                name="payment"
                onChange={(event) =>
                  this.setState({
                    totalPayment: event.target.value,
                  })
                }
                value={this.state.totalPayment}
              />
            </Form.Group>
          </Form.Row>

          <Button
            className="btn btn-primary btn-lg lead"
            onClick={this.handlePayment}
          >
            Save
          </Button>
        </Form>
      </div>
    );
  }
}

export default Pos;
