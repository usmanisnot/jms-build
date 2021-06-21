var express = require("express"),
  http = require("http"),
  app = require("express")(),
  server = http.createServer(app),
  bodyParser = require("body-parser"),
  io = require("socket.io")(server),
  liveCart = [];
const path = require("path");

// Have Node serve the files for our built React app
app.use(
  express.static(path.resolve(__dirname, "../jms-build/react-pos/build"))
);

const PORT = process.env.PORT || 8001;

console.log("Real time POS running");
console.log("Server started");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("/*", function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

app.get("/*", function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

// app.get("/", function(req, res) {
//   res.send(" Real time POS web app running.");
// });

app.use("/api/inventory", require("./api/inventory"));
app.use("/api", require("./api/transactions"));
app.use("/api/product", require("./api/products"));
app.use("/api/supplier", require("./api/suppliers"));
app.use("/api/customer", require("./api/customers"));

// Websocket logic for Live Cart
io.on("connection", function (socket) {
  socket.on("cart-transaction-complete", function () {
    socket.broadcast.emit("update-live-cart-display", {});
  });

  // upon page load, give user current cart
  socket.on("live-cart-page-loaded", function () {
    socket.emit("update-live-cart-display", liveCart);
  });

  // upon connecting, make client update live cart
  socket.emit("update-live-cart-display", liveCart);

  // when the cart data is updated by the POS
  socket.on("update-live-cart", function (cartData) {
    // keep track of it
    liveCart = cartData;

    // broadcast updated live cart to all websocket clients
    socket.broadcast.emit("update-live-cart-display", liveCart);
  });
});
//testgit
server.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
