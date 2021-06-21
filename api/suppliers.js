var app = require("express")();
var bodyParser = require("body-parser");
var Datastore = require("nedb");
var async = require("async");

app.use(bodyParser.json());

module.exports = app;

// Creates  Database
var supplierDB = new Datastore({
  filename: "./server/databases/supplier.db",
  autoload: true,
});

// GET all suppliers
app.get("/all", function (req, res) {
  supplierDB.find({}, function (err, docs) {
    console.log("sending inventory suppliers");
    res.send(docs);
  });
});

// GET all suppliers by term
app.get("/search", function (req, res) {
  supplierDB.find({ name: new RegExp(req.query.term) }, function (err, docs) {
    console.log("searching inventory suppliers");
    res.send(docs);
  });
});

// post supplier
app.post("/new", function (req, res) {
  var newsupplier = req.body;

  supplierDB.insert(newsupplier, function (err, supplier) {
    if (err) res.status(500).send(err);
    else res.send(supplier);
  });
});

//delete supplier using supplier id
app.delete("/:supplierId", function (req, res) {
  supplierDB.remove({ _id: req.params.supplierId }, function (err, numRemoved) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

// Updates inventory supplier
app.put("/update", function (req, res) {
  var supplierId = req.body._id;

  supplierDB.update(
    { _id: supplierId },
    req.body,
    {},
    function (err, numReplaced, supplier) {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
    }
  );
});

// GET a supplier from inventory by _id
app.get("/:supplierId", function (req, res) {
  if (!req.params.supplierId) {
    res.status(500).send("ID field is required.");
  } else {
    supplierDB.findOne({ _id: req.params.supplierId }, function (err, supplier) {
      res.send(supplier);
    });
  }
});

// GET inventory
app.get("/", function (req, res) {
  res.send("Inventory API");
});
