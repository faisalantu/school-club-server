const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());
//connect database

// init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.json({
    msg: "hello world!",
  });
});

//api routes here
app.use("/api/posts", require("./routes/posts"));
app.use("/api/events", require("./routes/events"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}!`);
});
