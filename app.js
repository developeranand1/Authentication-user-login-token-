const express = require("express");
const mongoose = require("./db");
const UserRouter=require('./routes/users')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/", UserRouter)


app.listen(port, () => {
  console.log(`Server listening on PORT ${port}`);
});
