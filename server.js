const express = require("express");
var cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());

//connect database
connectDB();
// init middleware
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.get("/", (req, res) => {
  res.json({
    msg: "hello world!",
  });
});

//api routes here
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/likepost", require("./routes/likePost"));
app.use("/api/events", require("./routes/events"));
app.use("/api/users", require("./routes/users"));
app.use("/api/clublist", require("./routes/clubList"));
app.use("/api/depertment", require("./routes/depertment"));
app.use("/api/role", require("./routes/role"));
app.use("/api/setroles", require("./routes/setRoles"));
app.use("/api/eventcategory", require("./routes/eventCategory"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}!`);
});
