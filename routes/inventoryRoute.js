//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build invetory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;