require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const eventRoutes = require("./routes/events");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/events", eventRoutes);

mongoose.connect(process.env.MONGO_URI, {
    // options if needed
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error(err));

app.listen(3000, () => console.log("Server running on port 3000"));
