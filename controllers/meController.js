const asyncHandler = require("express-async-handler");
const Me = require("../models/meModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const JWT_KEY = "hsdfkj";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All Fields are mandatory!");
  }

  const emailAvailable = await Me.findOne({ email });

  if (emailAvailable) {
    res.status(400);
    throw new Error("User already registers!");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password ", hashPassword);

  const data = await Me.create({
    username,
    email,
    password: hashPassword,
  });

  if (data) {
    res.status(201).json({ _id: data.id, email: data.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }

  console.log("Me Create data ", data);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All Fields are mandatory !");
  }

  const data = await Me.findOne({email});
  if(data && (await bcrypt.compare(password, data.password))){

    const accessToken=jwt.sign({
        datas:{
            username:data.username,
            email:data.email,
            id:data.id
        }
    },
    JWT_KEY,
    {expiresIn:'1h'}
    )

    res.status(200).json({accessToken})
  }
  else{
    res.status(401);
    throw new Error("email or password is not valid!")
  }

 
});

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.datas);
});

module.exports = { registerUser, loginUser, currentUser };
