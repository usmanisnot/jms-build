import React, { Component } from "react";
import "./App.css";
import Header from "./Header";
import Product from "./Product";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import productButtonRender from "./productButtonRender";
import MyCellRenderer from "./myCellRenderer";
import BarCode from "./BarCode/BarCode.jsx";
import BarCodeContainer from "./BarCode/BarCodeContainer.jsx";

const HOST = "http://localhost:8001";

class Inventory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      productFormModal: false,
      name: "",
      code: "",
      snackMessage: "",
      quantity: 1,
      listedPrice: 0,
      purchasePrice: 0,
      stockProvider: "",
      barCode: "NoCode",
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
          headerName: "Code",
          field: "code",
          sortable: true,
          filter: true,
          editable: true,
        },
        {
          headerName: "Purchase Price",
          field: "purchasePrice",
          sortable: true,
          filter: true,
          editable: true,
        },
        {
          headerName: "Listed Price",
          field: "listedprice",
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
          cellRenderer: "myCellRenderer",
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

    // this.handleNewProduct = this.handleNewProduct.bind(this);
    // this.handleName = this.handleName.bind(this);
    // this.handlePrice = this.handlePrice.bind(this);
    // this.handleQuantity = this.handleQuantity.bind(this);
    // this.handleSnackbar = this.handleSnackbar.bind(this);
  }

  handleNameEditinGrid(params) {}

  componentWillMount() {
    //get all products from server
    this.refreshAllProducts();
  }

  componentDidMount() {}

  updateBarCode = () => {
    var url = HOST + `/api/inventory/newid`;
    axios.get(url).then((response) => {
      console.log("newid: ", response);
      this.setState({ barCode: response.data.id });
    });
  };

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
      code: this.state.code,
      quantity: this.state.quantity,
      listedPrice: this.state.listedPrice,
      purchasePrice: this.state.purchasePrice,
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
  handleCode = (e) => {
    this.setState({ code: e.target.value });
  };
  handleListedPrice = (e) => {
    this.setState({ listedPrice: e.target.value });
  };
  handlePurchasePrice = (e) => {
    this.setState({ purchasePrice: e.target.value });
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

  addNewProduct = () => {
    this.updateBarCode();
    this.setState({ productFormModal: true });
  };

  render() {
    var { products, snackMessage } = this.state;

    return (
      <div>
        <Header />

        {/* <BarCodeContainer products={products} /> */}

        <div className="mainDiv content">
          <div
            className="ag-theme-alpine"
            style={{
              height: "600px",
              width: "100%",
              margin: "5px",
            }}
          >
            <input
              type="button"
              className="btn btn-success"
              value="Add new"
              onClick={this.addNewProduct}
              style={{ marginRight: 5, marginBottom: 5 }}
            />

            <input
              type="button"
              className="btn btn-info"
              value="View Barcodes"
              onClick={() => {
                this.props.history.push("/barcodes", products);
              }}
              style={{ marginLeft: 5, marginBottom: 5 }}
            />

            <AgGridReact
              frameworkComponents={{
                myCellRenderer: MyCellRenderer,
              }}
              columnDefs={this.state.columnDefs}
              rowData={this.state.products}
              animateRows
              showToolPanel={true}
              enableSorting={true}
              editType="fullRow"
              onCellValueChanged={this.handleonCellValueChanged}
              defaultColDef={{
                sortable: true,
                filter: true,
                flex: 1,
                resizable: true,
                editable: true,
                headerComponentParams: {
                  menuIcon: "fa-bars",
                },
              }}
            ></AgGridReact>
          </div>
        </div>

        <Modal size="lg" show={this.state.productFormModal}>
          <Modal.Header>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-horizontal" name="newProductForm">
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
                <label className="col-md-4 control-label" htmlFor="code">
                  Code
                </label>
                <div className="col-md-12">
                  <input
                    name="code"
                    placeholder="code"
                    className="form-control"
                    onChange={this.handleCode}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 control-label" htmlFor="price">
                  Purchase Price
                </label>
                <div className="col-md-12">
                  <input
                    name="purchasePrice"
                    placeholder="Price"
                    className="form-control"
                    onChange={this.handlePurchasePrice}
                    type="number"
                    value={this.state.purchasePrice}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 control-label" htmlFor="price">
                  Listed Price
                </label>
                <div className="col-md-12">
                  <input
                    name="listedPrice"
                    placeholder="Listed Price"
                    className="form-control"
                    onChange={this.handleListedPrice}
                    type="number"
                    value={this.state.listedPrice}
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
                  Size
                </label>
                <div className="col-md-12">
                  <input
                    name="stock_provider"
                    placeholder="Small/XL/XXL.."
                    onChange={this.handleProvider}
                    className="form-control"
                  />
                </div>
              </div>
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
                    disabled={true}
                    onChange={undefined}
                    value={this.state.barCode}
                  />
                </div>
                <div className="col-md-12">
                  {/* <canvas style={{ marginTop: 5 }} id="mycanvas"></canvas> */}
                  {/* <BarCode barCode={this.state.barCode} /> */}
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
