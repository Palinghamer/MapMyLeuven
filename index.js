require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const eventRoutes = require("node_modules/models/event.js");

const app = express();
app.use(express.json());
app.use(cors());
app.use("node_modules/models/event.js", eventRoutes);

mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error(err));

app.listen(3000, () => console.log("Server running on port 3000"));
