const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const JWT_KEY = "hsdfkj";

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_KEY, { expiresIn: "1h" });
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  jwt.verify(token.split(" ")[1], JWT_KEY, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Registration route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({ message: "User registered successfully!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete user route
router.delete("/delete-user/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get user data route
router.get("/get-user/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login route
router.post("/login", verifyToken, async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id);
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Protected route example
router.get("/protected-route", verifyToken, (req, res) => {
  res.status(200).json({ message: "This is a protected route", userId: req.userId });
});

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const User = require("../models/user");
// const jwt = require("jsonwebtoken");

// const JWT_KEY = "hsdfkj";

// // Function to generate JWT token
// const generateToken = (userId) => {
//   return jwt.sign({ userId }, JWT_KEY, { expiresIn: "1h" });
// };

// // Middleware to verify token
// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization;
//   console.log("Token received:", token); // Log token for debugging
//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized: Token missing" });
//   }

//   jwt.verify(token.split(" ")[1], JWT_KEY, (err, decoded) => {
//     if (err) {
//       console.error("Token verification error:", err); // Log verification error
//       return res.status(403).json({ message: "Forbidden: Invalid token" });
//     }
//     req.userId = decoded.userId;
//     next();
//   });
// };

// // Registration route
// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;
//   console.log(req.body);
//   try {
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Missing required fields!" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({ name, email, password: hashedPassword });
//     await user.save();

//     const token = generateToken(user._id);

//     res.status(201).json({ message: "User registered successfully!", token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error " });
//   }
// });

// router.delete("/delete-user/:userId", verifyToken, async (req, res) => {
//   try {

//     const userId= req.params.userId;

//     const user= await User.findByIdAndDelete(userId);

//     if(!user){
//         return res.status(404).json({message:"Data is already deleted!"});
//     }

//     return res.status(200).json({message:"Data is deleted!"})

//   } catch (error) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// router.get("/get-user", verifyToken, async (req, res) => {
//   try {
//     const userId = req.userId; // Get the userId from the verified token
//     const user = await User.findById(userId); // Find the user by userId
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Route to get user data by ID
// router.get("/get-user/:userId", verifyToken, async (req, res) => {
//   try {
//     const userId = req.params.userId; // Get the userId from the URL parameter
//     const user = await User.findById(userId); // Find the user by userId
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Login route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     if (!email || !password) {
//       return res.status(400).json({ message: "Missing email or password" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     const token = generateToken(user._id);
//     res.status(200).json({ message: "Login successful", token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // Protected route example
// router.get("/protected-route", verifyToken, (req, res) => {
//   res
//     .status(200)
//     .json({ message: "This is a protected route", userId: req.userId });
// });

// module.exports = router;
