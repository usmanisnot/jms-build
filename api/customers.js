var app = require("express")();
var bodyParser = require("body-parser");
var Datastore = require("nedb");
var async = require("async");

app.use(bodyParser.json());

module.exports = app;

// Creates  Database
var customersDB = new Datastore({
  filename: "./server/databases/customers.db",
  autoload: true,
});

// GET all customers
app.get("/all", function (req, res) {
  customersDB.find({}, function (err, docs) {
    console.log("sending customers");
    res.send(docs);
  });
});

// post new customer
app.post("/new", function (req, res) {
  var newCustomer = req.body;

  newCustomer = InsertCustomer(newCustomer)
  if(newCustomer.ErrorCode != undefined && newCustomer.ErrorCode == "500"){
    res.status(500).send(newCustomer.Error);
  }else{ 
    res.send(newCustomer);
  }
});

//delete customer using customer id
app.delete("/:customerId", function (req, res) {
  customersDB.remove({ _id: req.params.customerId }, function (err, numRemoved) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

// Updates customer
app.put("/update", function (req, res) {
  var customerId = req.body._id;

  customersDB.update(
    { _id: customerId },
    req.body,
    {},
    function (err, numReplaced, customer) {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
    }
  );
});

// GET inventory
app.get("/", function (req, res) {
  res.send("Customers API");
});

// GET a customer from inventory by _id
app.get("/:customerId", function (req, res) {
  if (!req.params.customerId) {
    res.status(500).send("ID field is required.");
  } else {
    customersDB.findOne({ _id: req.params.customerId }, function (err, customer) {
      res.send(customer);
    });
  }
});

app.InsertCustomer = function (newCustomer){
  console.log("inside customers Insert", newCustomer);
   customersDB.find({}, function (err, docs) {
    console.log("found customers", docs);
    if(docs.length > 0){
      customersDB.update(
        { _id: docs[0]._id },
        newCustomer,
        {},
        function (err, numReplaced, customer) {
          if (err) return {ErrorCode: '500', ErrorMessage: err};
          else return customer;
        }
      );
    }else{
      customersDB.insert(newCustomer, function (err, customer) {
        if (err) return {ErrorCode: '500', Error: err};
        else return customer;
      });
    }
  });
}
