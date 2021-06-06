import React from "react";
import { Switch, Route } from "react-router-dom";
import Inventory from "./Inventory";
import Pos from "./pos/Pos";
import Transactions from "./Transactions";
import LiveCart from "./LiveCart";
import Slip from "./receipt/receipt";
import BarCodeContainer from "./BarCode/BarCodeContainer";
import BarCode from "./BarCode/BarCode";

const Main = () => (
  <main className="mainDiv paper">
    <div className="mainChild">
      <Switch>
        <Route exact path="/" render={(props) => <Pos {...props} />} />
        <Route path="/inventory" component={Inventory} />
        <Route
          path="/transactions"
          render={(props) => <Transactions {...props} />}
        />
        <Route path="/livecart" component={LiveCart} />
        <Route path="/receipt" component={Slip} />
        <Route path="/barcodes" component={BarCodeContainer} />
        <Route path="/barcode" component={BarCode} />
      </Switch>
    </div>
  </main>
);

export default Main;
