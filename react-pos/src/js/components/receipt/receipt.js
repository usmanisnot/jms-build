import React from "react";
import ReactToPrint from "react-to-print";
import Moment from "react-moment";
import "./receipt.css";

class ComponentToPrint extends React.Component {
  renderItems() {
    var { items } = this.props;
    return items.map((item, i) => (
      <tr key={i}>
        <td className="no">{++i}</td>
        <td className="text-left">
          <h3>{item.barCode + " - " + item.name}</h3>
        </td>
        <td className="unit">Rs: {item.unitPrice}</td>
        <td className="qty">{item.quantity}</td>
        <td className="total">Rs {item.unitPrice * item.quantity}</td>
      </tr>
    ));
  }
  render() {
    var { date, customer, total, totalPayment } = this.props;
    var forDate = date == undefined ? new Date() : new Date(date);
    console.log("date for: ", date);
    return (
      <div id="invoice">
        <div className="invoice overflow-auto">
          <div style={{ minWidth: 600 }}>
            <header>
              <div className="row">
                <div className="col"></div>
                <div className="col company-details">
                  <h2 className="name">Yes Traders</h2>
                  <div>455 Foggy Heights, AZ 85004, US</div>
                  <div>(123) 456-789</div>
                  <div>company@example.com</div>
                </div>
              </div>
            </header>
            <main>
              <div className="row contacts">
                <div className="col invoice-to">
                  <div className="text-gray-light">INVOICE TO:</div>
                  <h2 className="to"> {customer && customer.name}</h2>
                  <div className="address">{customer && customer.address}</div>
                  <div className="email"></div>
                </div>
                <div className="col invoice-details">
                  <h1 className="invoice-id">INVOICE# {forDate.valueOf()}</h1>
                  <div className="date">
                    Date of Invoice:{" "}
                    <Moment local format="MMM D, YYYY">
                      {date}
                    </Moment>
                  </div>
                  <div className="date hidden">
                    Due Date:{" "}
                    <Moment local format="MMM D, YYYY">
                      {date}
                    </Moment>
                  </div>
                </div>
              </div>
              <table border="0" cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="text-left">DESCRIPTION</th>
                    <th className="text-right">UNIT PRICE</th>
                    <th className="text-right">QUANTITY</th>
                    <th className="text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody>{this.renderItems()}</tbody>
                <tfoot>
                  <tr className="hidden">
                    <td colSpan="2"></td>
                    <td colSpan="2">SUBTOTAL</td>
                    <td> Rs {total}</td>
                  </tr>
                  <tr className="hidden">
                    <td colSpan="2"></td>
                    <td colSpan="2">TAX 0%</td>
                    <td>RS 00.00</td>
                  </tr>
                  <tr>
                    <td colSpan="2"></td>
                    <td colSpan="2">GRAND TOTAL</td>
                    <td> Rs {total}</td>
                  </tr>
                  <tr>
                    <td colSpan="2"></td>
                    <td colSpan="2">TOTAL PAID</td>
                    <td> Rs {totalPayment}</td>
                  </tr>
                </tfoot>
              </table>
              <div className="thanks">Thank you!</div>
              <div className="notices">
                <div>NOTICE:</div>
                <div className="notice">
                  A finance charge of 1.5% will be made on unpaid balances after
                  30 days.
                </div>
              </div>
            </main>
            <footer>
              Invoice was created on a computer and is valid without the
              signature and seal.
            </footer>
          </div>
          <div></div>
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
        <button
          className="btn btn-danger"
          style={{ margin: 10 }}
          onClick={() => this.props.history.goBack()}
        >
          Back
        </button>
        <ReactToPrint
          trigger={() => <button className="btn btn-primary">Print</button>}
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
