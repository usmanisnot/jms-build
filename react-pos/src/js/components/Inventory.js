import React, { Component } from "react";
import "./App.css";
import Header from "./Header";
import Product from "./Product";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

import { AgGridReact, SortableHeaderComponent } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import productButtonRender from "./productButtonRender";

const HOST = "http://localhost:8001";

class Inventory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      productFormModal: false,
      name: "",
      snackMessage: "",
      quantity: 1,
      price: "",
      stockProvider: "",
      barCode: "",
      columnDefs: [
        {
          headerName: "Name",
          field: "name",
          sortable: true,
          filter: true,
          editable: true,
          cellEditor: "agTextCellEditor",
          valueSetter: function (params) {
            params.data.name = params.newValue;
            console.log("this: ", this);
            return true;
          },
        },
        {
          headerName: "Price",
          field: "price",
          sortable: true,
          filter: true,
          editable: true,
        },
        {
          headerName: "Quantity",
          field: "quantity",
          sortable: true,
          filter: true,
          editable: true,
        },
        {
          headerName: "Bar Code",
          field: "barCode",
          sortable: true,
          filter: true,
          editable: true,
        },
        {
          headerName: "Distributer",
          field: "stockProvider",
          sortable: true,
          filter: true,
          editable: true,
        },
        {
          headerName: "Unique id",
          field: "_id",
          hide: true,
        },
      ],
    };

    this.handleNewProduct = this.handleNewProduct.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handlePrice = this.handlePrice.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
    this.handleSnackbar = this.handleSnackbar.bind(this);
  }

  handleNameEditinGrid(params) {}

  componentWillMount() {
    //get all products from server
    this.refreshAllProducts();
  }
  refreshAllProducts() {
    var url = HOST + `/api/inventory/products`;
    axios.get(url).then((response) => {
      this.setState({ products: response.data }, () =>
        console.log("state products: ", this.state)
      );
    });
  }
  handleNewProduct = (e) => {
    e.preventDefault();
    this.setState({ productFormModal: false });
    var newProduct = {
      name: this.state.name,
      quantity: this.state.quantity,
      price: this.state.price,
      stockProvider: this.state.stockProvider,
      barCode: this.state.barCode,
    };

    axios
      .post(HOST + `/api/inventory/product`, newProduct)
      .then((response) => {
        this.setState({ snackMessage: "Product Added Successfully!" });
        console.log("then", response);
        this.refreshAllProducts();
        this.handleSnackbar();
      })
      .catch((err) => {
        console.log(err),
          this.setState({ snackMessage: "Product failed to save" }),
          this.handleSnackbar();
      });
  };
  handleEditProduct = (editProduct) => {
    axios
      .put(HOST + `/api/inventory/product`, editProduct)
      .then((response) => {
        this.setState({ snackMessage: "Product Updated Successfully!" });
        this.handleSnackbar();
        return true;
      })
      .catch((err) => {
        console.log(err);
        this.setState({ snackMessage: "Product Update Failed!" }),
          this.handleSnackbar();
        return false;
      });
  };

  handleName = (e) => {
    this.setState({ name: e.target.value });
  };
  handlePrice = (e) => {
    this.setState({ price: e.target.value });
  };
  handleQuantity = (e) => {
    this.setState({ quantity: e.target.value });
  };
  handleProvider = (e) => {
    this.setState({ stockProvider: e.target.value });
  };
  handleBarCode = (e) => {
    this.setState({ barCode: e.target.value });
  };
  handleSnackbar = () => {
    var bar = document.getElementById("snackbar");
    bar.className = "show";
    setTimeout(function () {
      bar.className = bar.className.replace("show", "");
    }, 3000);
  };

  handleonCellValueChanged = (event) => {
    this.handleEditProduct(event.data);
  };

  render() {
    var { products, snackMessage } = this.state;

    var renderProducts = () => {
      if (products.length === 0) {
        return <React.Fragment>{products} </React.Fragment>;
      } else {
        return products.map((product) => (
          <Product {...product} onEditProduct={this.handleEditProduct} />
        ));
      }
    };

    return (
      <div>
        <Header />

        <div className="mainDiv">
          <div
            className="ag-theme-alpine"
            style={{
              height: "550px",
              width: "900px",
            }}
          >
            <input
              type="button"
              className="btn btn-success"
              value="Add new"
              onClick={() => this.setState({ productFormModal: true })}
            />
            <AgGridReact
              columnDefs={this.state.columnDefs}
              rowData={this.state.products}
              animateRows
              showToolPanel="true"
              enableSorting="true"
              editType="fullRow"
              onCellValueChanged={this.handleonCellValueChanged}
              defaultColDef={{
                sortable: true,
                filter: true,
                flex: 1,
                resizable: true,
                editable: true,
                headerComponentFramework: SortableHeaderComponent,
                headerComponentParams: {
                  menuIcon: "fa-bars",
                },
              }}
            ></AgGridReact>
          </div>
        </div>
        {/* <div className="container">
          <a
            className="btn btn-success pull-right"
            onClick={() => this.setState({ productFormModal: true })}
          >
            <i className="glyphicon glyphicon-plus" /> Add New Item
          </a>
          <br />
          <br />

          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity on Hand</th>
                <th />
              </tr>
            </thead>
            { <tbody>{renderProducts()}</tbody> }
          </table>
        </div> */}

        <Modal show={this.state.productFormModal}>
          <Modal.Header>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-horizontal" name="newProductForm">
              <div className="form-group">
                <label className="col-md-4 control-label" htmlFor="barcode">
                  Barcode
                </label>
                <div className="col-md-12">
                  <input
                    id="barcode"
                    name="barcode"
                    placeholder="Barcode"
                    className="form-control"
                    onChange={this.handleBarCode}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 control-label" htmlFor="name">
                  Name
                </label>
                <div className="col-md-12">
                  <input
                    name="name"
                    placeholder="Name"
                    className="form-control"
                    onChange={this.handleName}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 control-label" htmlFor="price">
                  Price
                </label>
                <div className="col-md-12">
                  <input
                    name="price"
                    placeholder="Price"
                    className="form-control"
                    onChange={this.handlePrice}
                    type="number"
                    step="any"
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="col-md-8 control-label"
                  htmlFor="quantity_on_hand"
                >
                  Quantity On Hand
                </label>
                <div className="col-md-12">
                  <input
                    type="number"
                    name="quantity_on_hand"
                    placeholder="Quantity On Hand"
                    onChange={this.handleQuantity}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="form-group">
                <label
                  className="col-md-8 control-label"
                  htmlFor="stock_provider"
                >
                  Company/Distributer
                </label>
                <div className="col-md-12">
                  <input
                    name="stock_provider"
                    placeholder="Company or Distributer"
                    onChange={this.handleProvider}
                    className="form-control"
                  />
                </div>
              </div>
              <br /> <br /> <br />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ productFormModal: false })}>
              Close
            </Button>
            <Button onClick={this.handleNewProduct}>Submit</Button>
          </Modal.Footer>
        </Modal>
        <div id="snackbar">{snackMessage}</div>
      </div>
    );
  }
}

export default Inventory;
