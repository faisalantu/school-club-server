const express = require("express");
var cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());

//connect database
connectDB();
// init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.json({
    msg: "hello world!",
  });
});

//api routes here
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/events", require("./routes/events"));
app.use("/api/users", require("./routes/users"));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}!`);
});
