const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyparser = require("body-parser");
const serverless = require("serverless-http");
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
const PORT = process.env.PORT
mongoose.connect(process.env.DB_URI).then(() => { console.log("Db conneted succesfully"); }).catch((err) => { console.log(err); });
app.get("/", (req, res) => { return res.status(200).send({ msg: "Working App" }); });
require("./routes/adminRoutes")(app);
require("./routes/userRoute")(app);
app.listen(PORT, () => { console.log(`listening on port ${PORT}`); });
module.exports = { handler: serverless(app) };