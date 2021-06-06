var app = require("express")();
var server = require("http").Server(app);
var bodyParser = require("body-parser");
var Datastore = require("nedb");

var Inventory = require("./inventory");

const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

app.use(bodyParser.json());

module.exports = app;

// Create Database
var Transactions = new Datastore({
  filename: "./server/databases/transactions.db",
  autoload: true,
});

// app.get("/", function (req, res) {
//   res.send("Transactions API");
// });

// GET all transactions
app.get("/all", function (req, res) {
  Transactions.find({}, function (err, docs) {
    res.send(docs);
  });
});

// GET all transactions
app.get("/limit", function (req, res) {
  var limit = parseInt(req.query.limit, 10);
  if (!limit) limit = 5;

  Transactions.find({})
    .limit(limit)
    .sort({ date: -1 })
    .exec(function (err, docs) {
      res.send(docs);
    });
});

// GET total sales for the current day
app.get("/day-total", function (req, res) {
  // if date is provided
  if (req.query.date) {
    startDate = new Date(req.query.date);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(req.query.date);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // beginning of current day
    var startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    // end of current day
    var endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  }

  Transactions.find(
    { date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } },
    function (err, docs) {
      var result = {
        date: startDate,
      };

      if (docs) {
        var total = docs.reduce(function (p, c) {
          return p + c.total;
        }, 0.0);

        result.total = parseFloat(parseFloat(total).toFixed(2));

        res.send(result);
      } else {
        result.total = 0;
        res.send(result);
      }
    }
  );
});

// GET transactions for a particular date
app.get("/by-date", function (req, res) {
  var startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  var endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  Transactions.find(
    { date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } },
    function (err, docs) {
      if (docs) res.send(docs);
    }
  );
});

// Add new transaction
app.post("/new", function (req, res) {
  var newTransaction = req.body;

  Transactions.insert(newTransaction, function (err, transaction) {
    if (err) res.status(500).send(err);
    else {
      res.sendStatus(200);
      Inventory.decrementInventory(transaction.items);
    }
  });
});

app.post("/print", function (req, res) {
  var transactionToPrint = req.body;
  res.send(printReciept(transactionToPrint));
});

// GET a single transaction
app.get("/:transactionId", function (req, res) {
  Transactions.find({ _id: req.params.transactionId }, function (err, doc) {
    if (doc) res.send(doc[0]);
  });
});

//delete product using product id
app.delete("/:transactionId", function (req, res) {
  console.log("delete called: ", req.params);
  Transactions.remove(
    { _id: req.params.transactionId },
    function (err, numRemoved) {
      if (err) res.status(500).send(err);
      else res.sendStatus(200);
    }
  );
});

app.get("/balance/:customerId", function (req, res) {
  var balanceDue = 0.0;
  Transactions.find({}, function (err, docs) {
    docs.forEach((element) => {
      if (
        element.customer != undefined &&
        element.customer.phone == req.params.customerId
      ) {
        var localBal = parseInt(element.totalPayment) - parseInt(element.total);
        if (localBal) {
          balanceDue = balanceDue + localBal;
        }
      }
    });
    res.send({ previousBalance: balanceDue });
  });
});

app.get("/customers/all", function (req, res) {
  var customers = [];
  Transactions.find({}, function (err, docs) {
    docs.forEach((element) => {
      if (element.customer) {
        customers.push(element.customer);
      }
    });

    res.send(removeDuplicates(customers, "phone"));
  });
});

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

function printReciept(transaction) {
  try {
    let printer = new ThermalPrinter({
      type: PrinterTypes.STAR, // Printer type: 'star' or 'epson'
      interface: "tcp://xxx.xxx.xxx.xxx", // Printer interface
      characterSet: "SLOVENIA", // Printer character set - default: SLOVENIA
      removeSpecialCharacters: false, // Removes special characters - default: false
      lineCharacter: "=", // Set character for lines - default: "-"
      options: {
        // Additional options
        timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
      },
    });
    printer.print("Hello World");
    printer.println("Hello World");
    printer.partialCut();
    return { code: "OK", desc: "ok" };
  } catch (e) {
    {
      return {
        code: "ERROR",
        desc: e,
      };
    }
  }
}
