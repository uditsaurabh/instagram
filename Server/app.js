const express = require("express");
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
const app = express();

const port = 3000;
//mongodb+srv://Instagram:<password>@cluster0.1z4iq.mongodb.net/<dbname>?retryWrites=true&w=majority

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("connected to mongoose");
});
mongoose.connection.on("error", error => {
  console.log("error", error);
});
const custommiddleware = (req, res, next) => {
  console.log("request made");
  next();
};
app.use(express.json());
app.use(custommiddleware);
app.use(require("./routes/auth"));
app.use(require("./routes/postRoute"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
