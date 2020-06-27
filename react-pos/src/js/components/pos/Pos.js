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
import Checkout from "../Checkout"
import htmlToImage from 'html-to-image';

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
      //this.setState({ amountDueModal: true });
    }
    this.OpenPopup();
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

  OpenPopup () {
    window.open("./template.html", '_blank');
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
        <div style={{display: 'none'}} id="recipt_mapped" >
          
          <div id="invoice-POS">
            <center id="top">
              <div className="logo"></div>
              <div className="info"> 
              <h2>Javed Medical Store</h2>
              <p> 
                Main bazar, Kot Samaba <br />
                Phone: 0300-6716165
              </p>
            </div>
            </center>
      
            <div id="mid-line">
              <div style={{color: "#fff"}}>
            ____________________
            </div>
            </div>
      
            <div id="bot">

                  <div id="table">
                    <table>
                      <tr className="tabletitle">
                        <td className="item"><h2>Item</h2></td>
                        <td className="Hours"><h2>Qty</h2></td>
                        <td className="Rate"><h2>Sub Total</h2></td>
                      </tr>

                      <tr className="service">
                        <td className="tableitem"><p className="itemtext">panadol extra</p></td>
                        <td className="tableitem"><p className="itemtext">5</p></td>
                        <td className="tableitem"><p className="itemtext">30.00</p></td>
                      </tr>

                      <tr className="service">
                        <td className="tableitem"><p className="itemtext">Caflam 50mg</p></td>
                        <td className="tableitem"><p className="itemtext">3</p></td>
                        <td className="tableitem"><p className="itemtext">95.00</p></td>
                      </tr>

                      <tr className="service">
                        <td className="tableitem"><p className="itemtext">Nestle water large</p></td>
                        <td className="tableitem"><p className="itemtext">1</p></td>
                        <td className="tableitem"><p className="itemtext">70.00</p></td>
                      </tr>

                      <tr className="service">
                        <td className="tableitem"><p className="itemtext">Medicam medium</p></td>
                        <td className="tableitem"><p className="itemtext">1</p></td>
                        <td className="tableitem"><p className="itemtext">55.00</p></td>
                      </tr>

                      <tr className="tabletitle">
                        <td></td>
                        <td className="Rate"><h2>tax</h2></td>
                        <td className="payment"><h2>RS: 0</h2></td>
                      </tr>

                      <tr className="tabletitle">
                        <td></td>
                        <td className="Rate"><h2>Total</h2></td>
                        <td className="payment"><h2>RS: 250</h2></td>
                      </tr>

                    </table>
                  </div>

                  <div id="legalcopy">
                    <p className="legal"><strong>Thank you for your business!</strong>  Errors and omissions excepted. 
                    </p>
                  </div>
                </div>
          </div>
        </div>
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
          <div>
              <button
                className="btn btn-success lead"
                id="checkoutButton"
                onClick={this.handleCheckOut}
              >
                <i className="glyphicon glyphicon-shopping-cart" />
                <br />
                <br />
                C<br />
                h<br />
                e<br />
                c<br />
                k<br />
                o<br />
                u<br />
                t
              </button>
              <div className="modal-body">
                <Modal show={this.state.checkOutModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Checkout</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div ng-hide="transactionComplete" className="lead">
                      <h3>
                        Total:
                        <span className="text-danger">
                          {" "}
                          {this.state.total}{" "}
                        </span>
                      </h3>

                      <form
                        className="form-horizontal"
                        name="checkoutForm"
                        onSubmit={this.handlePayment}
                      >
                        <div className="form-group">
                          <div className="input-group">
                            <div className="input-group-addon">$</div>
                            <input
                              type="number"
                              id="checkoutPaymentAmount"
                              className="form-control input-lg"
                              name="payment"
                              onChange={event =>
                                this.setState({
                                  totalPayment: event.target.value
                                })
                              }
                              min="0"
                            />
                          </div>
                        </div>

                        <p className="text-danger">Enter payment amount.</p>
                        <div className="lead" />
                        <Button
                          className="btn btn-primary btn-lg lead"
                          onClick={this.handlePayment}
                        >
                          Print Receipt
                        </Button>
                      </form>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      onClick={() => this.setState({ checkOutModal: false })}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>

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
            <tbody>
            {renderLivePos()}
            </tbody>
            <tfoot className="tableFoot" >
            <tr>
              <td colSpan={3}>
              <span className="text-primary checkout-total-price">
              Total Bill
                </span>
                </td>
              <td colSpan={3}>
                <span className="text-primary checkout-total-price pull-right">
                  {this.state.total}
                </span>
              </td>
            </tr>
          </tfoot>
          </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Pos;
