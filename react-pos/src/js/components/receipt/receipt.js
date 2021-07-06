import React from "react";
import ReactToPrint from "react-to-print";
import axios from "axios";
import "./receipt.css";

const HOST = "http://localhost:8001";

class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderItems() {
    var { items } = this.props;
    console.log("items: ", items);
    return items.map((item, i) => (
      <tr key={i}>
        <td className="quantityReciept">{item.quantity}</td>
        <td className="descriptionReciept">{item.name}</td>
        <td className="priceReciept">
          Total(Rs): {parseFloat(item.lineTotal)}
					{item.totalDiscount > 0 &&
						<div>
							Dicounted(Rs) {parseFloat(item.lineTotal) - parseFloat(item.totalDiscount)}
						</div>
					}
        </td>
      </tr>
    ));
  }

  render() {
    var { date, customer, total, totalPayment, previousBalance } = this.props;
    var forDate = date == undefined ? new Date() : new Date(date);
    console.log("date for: ", date);
    return (
      <div className="ticket">
        <div className="brandingContainer">
          <div className="branding" />
        </div>
        <p className="centered">Club Road, Rahim yar khan</p>
        <table>
          <thead>
            <tr>
              <th className="quantityReciept">Q.</th>
              <th className="descriptionReciept">Description</th>
							<th className="priceReciept">Total</th>
            </tr>
          </thead>
					<tbody>{this.renderItems()}</tbody>
					<tfoot>
						<td></td>
						<td></td>
						<td>
							Total: {total}
						</td>
					</tfoot>
        </table>
        <p className="centered">Thanks for your purchase!</p>
      </div>
    );
  }
}

class Slip extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props.location.state, previousBalance: 0.0 };
  }

  componentDidMount = () => {
    this.getBalance();
    console.log("this.tate: ", this.state);
  };
  getBalance = () => {
    var url = HOST + `/api/balance/` + this.state.customer.phone;
    axios.get(url).then((response) => {
      this.setState({ previousBalance: response.data.previousBalance });
    });
  };

  getPrinter() {
    var url = HOST + `/api/print/`;
    axios.post(url).then((response) => {
      console.log("test success");
    });
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

        {/* <button
          className="btn btn-info"
          style={{ margin: 10 }}
          onClick={() => this.getPrinter()}
        >
          Print thermal
        </button> */}

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
