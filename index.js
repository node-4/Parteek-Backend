const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const compression = require("compression");
const serverless = require("serverless-http");
const app = express();
const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI
app.use(compression({ threshold: 500 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, }).then(() => { console.log('Connected to MongoDB'); }).catch((error) => { console.error('Error connecting to MongoDB:', error); });
require('./routes/userRoute')(app);
require('./routes/adminRoutes')(app);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});
module.exports = { handler: serverless(app) };