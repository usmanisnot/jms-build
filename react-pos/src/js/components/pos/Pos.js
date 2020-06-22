import React, { Component } from "react";
import "../App.css";
import Header from "../Header";
import io from "socket.io-client";
import axios from "axios";
import moment from "moment";
import { Table, Modal, Button } from "react-bootstrap";
import PosItem from "./PosItem";
import ProductsDropdown from "./ProductsDropdown";
import SearchBar from "./searchBar";

const HOST = "http://localhost:8001";
let socket = io.connect(HOST);

class Pos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      selectedProduct:{},
      addItemModal: false,
      checkOutModal: false,
      amountDueModal: false,
      totalPayment: 0,
      total: 0,
      changeDue: 0,
      products:[],
      currentItem: {
        id: "",
        name: "",
        price: 0,
        unitPrice: 0,
        quantity: 1,
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
    this.handlePayment = this.handlePayment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckOut = this.handleCheckOut.bind(this);
    this.handleProductAdd = this.handleProductAdd.bind(this);
  }

  componentWillMount() {
    var url = HOST + `/api/inventory/products`;
    axios.get(url).then(response => {
      this.setState({ products: response.data }, ()=>{console.log("state updated: ", response)});
    });
  }

  componentDidUpdate() {
    if (this.state.items.length !== 0) {
      socket.emit("update-live-cart", this.state.items);
    }
  }

  handleSubmit = e => {
    this.setState({ addItemModal: false });

    const currentItem = {
      id: this.state.id,
      name: this.state.name,
      price: this.state.price,
      unitPrice: this.state.unitPrice,
      quantity: this.state.quantity,
    };
    this.addItem(currentItem);
    this.updateTotal();
  };
  addItem = (item) => {
    console.log("this.state.items: ", this.state.items);
    var items = this.state.items;
    var foundItemIndex = items.findIndex(i => i.id == item.id);
    console.log("foundItemIndex: ", foundItemIndex);
    if(foundItemIndex >= 0){
      this.plusQuantity(items, foundItemIndex);
      if(items[foundItemIndex] != null && items[foundItemIndex] != undefined){
        items[foundItemIndex].quantity++;
      }
    }else{
      items.push(item);
    }
    this.setState({ items: items }, ()=> console.log("updated state addItem: ", this.state));
  }
  plusQuantity = (item, foundItemIndex) => {

  };

  handleName = e => {
    this.setState({ name: e.target.value });
  };
  handlePrice = e => {
    this.setState({ price: e.target.value });
  };
  handleQuantity = e => {
    this.setState({ price: this.state.unitPrice * e.target.value });
  };
  handlePayment = () => {
    this.setState({ checkOutModal: false });
    var amountDiff =
      parseInt(this.state.total, 10) - parseInt(this.state.totalPayment, 10);
    if (this.state.total <= this.state.totalPayment) {
      this.setState({ changeDue: amountDiff });
      this.setState({ receiptModal: true });
      this.handleSaveToDB();
      this.setState({ items: [] });
      socket.emit("update-live-cart", []);
    } else {
      this.setState({ changeDue: amountDiff });
      this.setState({ amountDueModal: true });
    }
  };
  handleChange = (id, value) => {
    var items = this.state.items;
    if (value === "delete") {
      var newitems = items.filter(function(item) {
        return item.id !== id;
      });
      this.setState({ items: newitems });
    } else {
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          items[i].quantity = value;
          this.setState({ items: items });
        }
      }
    }
    this.updateTotal();
  };
  handleCheckOut = () => {
    this.setState({ checkOutModal: true });
    this.updateTotal();
  };

  updateTotal = () =>{
    var items = this.state.items;
    var totalCost = 0;
    for (var i = 0; i < items.length; i++) {
      var price = items[i].price * items[i].quantity;
      totalCost = parseInt(totalCost, 10) + parseInt(price, 10);
    }
    this.setState({ total: totalCost });
  };

  handleSaveToDB = () => {
    const transaction = {
      date: moment().format("DD-MMM-YYYY HH:mm:ss"),
      total: this.state.total,
      items: this.state.items
    };
    axios.post(HOST + "/api/new", transaction).catch(err => {
      console.log(err);
    });
  };
  handleProductSelect = (item) => {
    console.log("item: ", item);
    if(item != undefined && item != null){
      let selectedProduct = this.state.products.find(function(prod){ return prod._id == item.value });
      this.handleProductAdd(selectedProduct);
      //this.setState({selectedProduct: selectedProduct, unitPrice: selectedProduct.price}, ()=> console.log("updated state: ", this.state))
    }
  };

  handleProductAdd = (selectedProduct) => {
    const currentItem = {
      id: "_billableItem_" + selectedProduct._id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      unitPrice: selectedProduct.price,
      quantity: 1,
    };
    this.addItem(currentItem);
    this.updateTotal();
  };

  render() {
    var { quantity, modal, items } = this.state;

    var renderAmountDue = () => {
      return (
        <Modal show={this.state.amountDueModal}>
          <Modal.Header closeButton>
            <Modal.Title>Amount</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>
              Amount Due:
              <span className="text-danger">{this.state.changeDue}</span>
            </h3>
            <p>Customer payment incomplete; Correct and Try again</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ amountDueModal: false })}>
              close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    };
    var renderReceipt = () => {
      return (
        <Modal show={this.state.receiptModal}>
          <Modal.Header closeButton>
            <Modal.Title>Receipt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>
              Total:
              <span className="text-danger">{this.state.totalPayment}</span>
            </h3>
            <h3>
              Change Due:
              <span className="text-success">{this.state.changeDue}</span>
            </h3>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ receiptModal: false })}>
              close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    };

    var renderLivePos = () => {
      console.log("renderLivePos, items: ", items)
      if (items.length === 0) {
        return <tr>
                <td colSpan={7} >No products added</td>
            </tr>;
      } else {
        return items.map(
          item => <PosItem key={item.id} {...item} onChange={this.handleChange} />,
          this
        );
      }
    };

    return (
      <div>
        <Header />
        <ProductsDropdown
              onProductSelect={this.handleProductSelect}
          />
        <div className="container">
          {renderAmountDue()}
          {renderReceipt()}
          <div className="tableContainer">
          <table className="pos table table-responsive table-striped table-hover posTable">
            <thead>
              <tr>
                <td colSpan="6" className="text-center">
                  
                </td>
              </tr>
              <tr className="titles">
                <th>Name</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Tax</th>
                <th>Total</th>
                <th />
              </tr>
            </thead>
            <tbody>{renderLivePos()}</tbody>
            <tfoot className="tableFoot" >
            <tr>
              <td colSpan={3}>
              <span className="text-success checkout-total-price">
              Total Bill
                </span>
                </td>
              <td colSpan={3}>
                <span className="text-success checkout-total-price pull-right">
                  {this.state.total}
                </span>
              </td>
            </tr>
          </tfoot>
          </table>
          </div>
          <div>
            <button
              className="btn btn-success lead"
              onClick={this.handleCheckOut}
            >
              <i className="glyphicon glyphicon-shopping-cart" />Checkout
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Pos;
