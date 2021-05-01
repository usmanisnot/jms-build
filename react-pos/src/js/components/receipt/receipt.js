import React from "react";
import ReactToPrint from "react-to-print";
import Moment from "react-moment";
import "./receipt.css";

const thStyle = {
  fontFamily: "Anton",
  fontWeight: "normal",
  fontStyle: "normal",
};

class ComponentToPrint extends React.Component {
  renderItems() {
    var { items } = this.props;
    return items.map((item, i) => (
      <div class="row mb-2 mb-sm-0 py-25 bgc-default-l4">
        <div class="d-none d-sm-block col-1">{i}</div>
        <div class="col-9 col-sm-5">{item.barCode + " - " + item.name}</div>
        <div class="d-none d-sm-block col-2">{item.quantity}</div>
        <div class="d-none d-sm-block col-2 text-95">Rs: {item.unitPrice}</div>
        <div class="col-2 text-secondary-d2">
          Rs {item.unitPrice * item.quantity}
        </div>
      </div>
    ));
  }
  render() {
    var { date, customer } = this.props;
    var forDate = new Date(date);
    return (
      <div id="bot">
        <link
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          rel="stylesheet"
        />

        <div className="page-content container">
          {/* <div className="page-header text-blue-d2">
            <h1 className="page-title text-secondary-d1">
              Invoice
              <small className="page-info">
                <i className="fa fa-angle-double-right text-80"></i>
                ID: #{forDate.valueOf()}
              </small>
            </h1>

            <div className="page-tools">
              <div className="action-buttons">
                <a
                  className="btn bg-white btn-light mx-1px text-95"
                  href="#"
                  data-title="Print"
                >
                  <i className="mr-1 fa fa-print text-primary-m1 text-120 w-2"></i>
                  Print
                </a>
                <a
                  className="btn bg-white btn-light mx-1px text-95"
                  href="#"
                  data-title="PDF"
                >
                  <i className="mr-1 fa fa-file-pdf-o text-danger-m1 text-120 w-2"></i>
                  Export
                </a>
              </div>
            </div>
          </div> */}

          <div className="container px-0">
            <div className="row mt-4">
              <div className="col-12 col-lg-10 offset-lg-1">
                <div className="row">
                  <div className="col-12">
                    <div className="text-center text-150">
                      <h3 className="text-default-d3">Yes Traders</h3>
                    </div>
                  </div>
                </div>

                <hr className="row brc-default-l1 mx-n1 mb-4" />

                <div className="row">
                  <div className="col-sm-6">
                    <div>
                      <span className="text-sm text-grey-m2 align-middle">
                        To:
                      </span>
                      <span className="text-600 text-110 text-blue align-middle">
                        {customer && customer.name}
                      </span>
                    </div>
                    <div className="text-grey-m2">
                      <div className="my-1">{customer && customer.address}</div>
                      {/* <div className="my-1">State, Country</div> */}
                    </div>
                  </div>

                  <div className="text-95 col-sm-6 align-self-start d-sm-flex justify-content-end">
                    <hr className="d-sm-none" />
                    <div className="text-grey-m2">
                      <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">
                        Invoice
                      </div>

                      <div className="my-2">
                        <i className="fa fa-circle text-blue-m2 text-xs mr-1"></i>{" "}
                        <span className="text-600 text-90">ID:</span> #111-222
                      </div>

                      <div className="my-2">
                        <i className="fa fa-circle text-blue-m2 text-xs mr-1"></i>{" "}
                        <span className="text-600 text-90">Issue Date:</span>{" "}
                        <Moment local format="MMM D, YYYY">
                          {date}
                        </Moment>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div class="row text-600 text-white bgc-default-tp1 py-25">
                    <div class="d-none d-sm-block col-1">#</div>
                    <div class="col-9 col-sm-5">Description</div>
                    <div class="d-none d-sm-block col-4 col-sm-2">Qty</div>
                    <div class="d-none d-sm-block col-sm-2">Unit Price</div>
                    <div class="col-2">Amount</div>
                  </div>
                  <div class="text-95 text-secondary-d3">
                    {this.renderItems()}
                  </div>
                  <div className="row mt-3">
                    <div className="col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0"></div>

                    <div className="col-12 col-sm-5 text-grey text-90 order-first order-sm-last pull-right">
                      <div className="row my-2">
                        <div className="col-7 text-right">SubTotal</div>
                        <div className="col-5">
                          <span className="text-120 text-secondary-d1">
                            Rs 2,250
                          </span>
                        </div>
                      </div>

                      <div className="row my-2">
                        <div className="col-7 text-right">Tax (10%)</div>
                        <div className="col-5">
                          <span className="text-110 text-secondary-d1">
                            225
                          </span>
                        </div>
                      </div>

                      <div className="row my-2 align-items-center bgc-primary-l3 p-2">
                        <div className="col-7 text-right">Total Amount</div>
                        <div className="col-5">
                          <span className="text-150 text-success-d3 opacity-2">
                            Rs: 2,475
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <div>
                    <span className="text-secondary-d1 text-105">
                      Thank you for your business
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Slip extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.location.state;
    console.log("this.state: ", this.state);
  }
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => (
            <a
              className="btn bg-white btn-light mx-1px text-95"
              href="#"
              data-title="Print"
            >
              <i className="mr-1 fa fa-print text-primary-m1 text-120 w-2"></i>
              Print
            </a>
          )}
          content={() => this.componentRef}
        />
        <ComponentToPrint
          int
          ref={(el) => (this.componentRef = el)}
          {...this.state}
        />
      </div>
    );
  }
}

export default Slip;
