const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const vcRoutes = require('./routes/vc');
const studentRoutes = require("./routes/students");
const vcBulkRoutes = require("./routes/vcBulk");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '2mb' }));

// MongoDB connection
const port = process.env.PORT || 5000;

app.use('/vc', vcRoutes);
app.use("/api/students", studentRoutes);
app.use("/vc", vcBulkRoutes);

app.listen(port, () => console.log('Server running on', port));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ Mongo connection error:", err));
