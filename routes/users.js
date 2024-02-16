// const express = require("express");
// const router = express.Router();
// const bcrypt= require('bcryptjs');
// const User = require("../models/user");
// const jwt = require('jsonwebtoken')

// const JWT_KEY="hsdfkj";

// // Function to generate JWT token
// const generateToken = (userId) => {
//     return jwt.sign({ userId }, JWT_KEY, { expiresIn: '1h' });
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



// // Route to get user data
// router.get('/get-user', verifyToken, async (req, res) => {
//     try {
//         const userdata = await User.find();
//         if (!userdata || userdata.length === 0) {
//             return res.status(404).json({ message: "User data not found" });
//         }
//         return res.status(200).json(userdata);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });


// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         if (!email || !password) {
//             return res.status(400).json({ message: "Missing email or password" });
//         }

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Debugging: Log hashed password stored in the database
//         console.log("Stored hashed password:", user.password);

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             // Debugging: Log hashed version of provided password
//             const hashedInputPassword = await bcrypt.hash(password, 10);
//             console.log("Hashed input password:", hashedInputPassword);

//             return res.status(401).json({ message: "Invalid password" });
//         }

//         const token = generateToken(user._id);
//         res.status(200).json({ message: "Login successful", token });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });


// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization;
//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized: Token missing" });
//     }

//     jwt.verify(token, JWT_KEY, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ message: "Forbidden: Invalid token" });
//         }
//         req.userId = decoded.userId;
//         next();
//     });
// };

// // Protected route example
// router.get('/protected-route', verifyToken, (req, res) => {
//     res.status(200).json({ message: "This is a protected route", userId: req.userId });
// });


// module.exports = router;


const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const JWT_KEY = "hsdfkj";

// Function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_KEY, { expiresIn: '1h' });
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    jwt.verify(token, JWT_KEY, (err, decoded) => {
        if (err) {
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
        res.status(500).json({ message: "Internal Server Error " });
    }
});

// Route to get user data
router.get('/get-user', verifyToken, async (req, res) => {
    try {
        const userdata = await User.find();
        if (!userdata || userdata.length === 0) {
            return res.status(404).json({ message: "User data not found" });
        }
        return res.status(200).json(userdata);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Login route
router.post("/login", async (req, res) => {
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
router.get('/protected-route', verifyToken, (req, res) => {
    res.status(200).json({ message: "This is a protected route", userId: req.userId });
});

module.exports = router;

