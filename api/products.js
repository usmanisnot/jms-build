var app = require("express")();
var bodyParser = require("body-parser");
var Datastore = require("nedb");
var async = require("async");

app.use(bodyParser.json());

module.exports = app;

// Creates  Database
var inventoryDB = new Datastore({
  filename: "./server/databases/products.db",
  autoload: true,
});

// GET all inventory products
app.get("/all", function (req, res) {
  inventoryDB.find({}, function (err, docs) {
    console.log("sending inventory products");
    res.send(docs);
  });
});

// GET all inventory products
app.get("/search", function (req, res) {
  inventoryDB.find({ name: new RegExp(req.query.term) }, function (err, docs) {
    console.log("searching inventory products");
    res.send(docs);
  });
});

// post inventory product
app.post("/new", function (req, res) {
  var newProduct = req.body;

  inventoryDB.insert(newProduct, function (err, product) {
    if (err) res.status(500).send(err);
    else res.send(product);
  });
});

//delete product using product id
app.delete("/:productId", function (req, res) {
  inventoryDB.remove({ _id: req.params.productId }, function (err, numRemoved) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

// Updates inventory product
app.put("/update", function (req, res) {
  var productId = req.body._id;

  inventoryDB.update(
    { _id: productId },
    req.body,
    {},
    function (err, numReplaced, product) {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
    }
  );
});

// GET inventory
app.get("/", function (req, res) {
  res.send("Inventory API");
});
