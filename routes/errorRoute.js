const express = require("express")
const router = new express.Router()
const errorContro = require("../controllers/errorController")

router.get("/500", errorContro.buildErrorPage)

module.exports = router


