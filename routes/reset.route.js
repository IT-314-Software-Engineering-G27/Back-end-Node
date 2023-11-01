const express = require("express");
const resetRouter = express.Router();
const ResetController = require("../controllers/reset.controller");

resetRouter.post("/", ResetController.create);
resetRouter.post("/:id", ResetController.apply);

module.exports = resetRouter;