const express = require("express");
const mongoose = require("./db");
const UserRouter=require('./routes/users');
const meRouter=require('./routes/me')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// app.use("/", UserRouter);
app.use('/', meRouter);


app.listen(port, () => {
  console.log(`Server listening on PORT ${port}`);
});
