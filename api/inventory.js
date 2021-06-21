var app = require("express")();
var bodyParser = require("body-parser");
var Datastore = require("nedb");
var async = require("async");

app.use(bodyParser.json());

module.exports = app;

// Creates  Database
var inventoryDB = new Datastore({
  filename: "./server/databases/inventory.db",
  autoload: true,
});


// GET all inventory
app.get("/all", function (req, res) {
  try{
    inventoryDB.find({}, function (err, docs) {
    console.log("sending inventory");
    res.send(docs);
  });
  }catch(e){
    console.log("catch", e);
  }
});


// GET a inventory from inventory by _id
app.get("/:itemId", function (req, res) {
  try{
    if (!req.params.itemId) {
      res.status(500).send("ID field is required.");
    } else {
    inventoryDB.findOne({ _id: req.params.itemId }, function (err, inventory) {
      res.send(inventory);
    });
  }
  }
  catch(e){

  }
});

// GET all inventory inventorys
app.get("/search", function (req, res) {
  inventoryDB.find({ name: new RegExp(req.query.term) }, function (err, docs) {
    // console.log("searching inventory inventorys");
    res.send(docs);
  });
});

// post inventory new item
app.post("/new", function (req, res) {
  var newinventory = req.body;

  inventoryDB.insert(newinventory, function (err, inventory) {
    if (err) res.status(500).send(err);
    else res.send(inventory);
  });
});

//delete inventory using inventory id
app.delete("/:itemId", function (req, res) {
  inventoryDB.remove({ _id: req.params.itemId }, function (err, numRemoved) {
    if (err) res.status(500).send(err);
    else res.sendStatus(200);
  });
});

// Updates inventory inventory
app.put("/update", function (req, res) {
  var inventoryId = req.body._id;

  inventoryDB.update(
    { _id: inventoryId },
    req.body,
    {},
    function (err, numReplaced, inventory) {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
    }
  );
});

// GET inventory
app.get("/", function (req, res) {
  // console.log("inside inventory /");
  res.send("Inventory API");
});

app.decrementInventory = function (items) {
  async.eachSeries(items, function (item, callback) {
    inventoryDB.findOne(
      { _id: item.id.replace("_billableItem_", "") },
      function (err, inventory) {
        console.log("inventory: ", inventory);
        // catch manually added items (don't exist in inventory)
        if (!inventory || !inventory.quantity) {
          callback();
        } else {
          var updatedQuantity =
            parseInt(inventory.quantity) - parseInt(item.quantity);
          console.log("updatedQuantity: ", updatedQuantity);
          console.log("transactioninventory: ", updatedQuantity);
          inventoryDB.update(
            { _id: inventory._id },
            { $set: { quantity: updatedQuantity } },
            {},
            callback
          );
        }
      }
    );
  });
};
