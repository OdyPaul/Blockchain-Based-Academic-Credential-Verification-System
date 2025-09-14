const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const studentRoutes = require("./routes/students");


const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/capstone");

app.use("/api/students", studentRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
