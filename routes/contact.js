const express = require("express");
const router = express.Router();
const {
  getContact,
  postContact,
  putContact,
  deleteContact,
  getByIdContact,
} = require("../controllers/contactController");

// There are  multiple way to dealer the router

// router.get("/", getContact);

// router.post("/", postContact);

// router.put("/:id", putContact);

// router.delete("/:id", deleteContact);

// router.get("/:id", getByIdContact);

// Second way 
router.get("/", getContact).post("/", postContact);


router.put("/:id", putContact).delete("/:id", deleteContact).get("/:id", getByIdContact);

module.exports = router;
