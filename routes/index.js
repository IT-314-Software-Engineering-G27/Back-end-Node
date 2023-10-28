const express = require('express');
const authRouter = require("./auth.route");
const individualRouter = require("./individual.route");
const fileRouter = require("./file.route");
const router = express.Router();

router.get('/', function (req, res, next) {
    res.json({
        "message": "Server OK",
        "payload": {
            "name": "StartApp API",
            "version": "1.0.0",
            "author": "Group 27",
        }
    });
});

router.use('/individuals', individualRouter);
router.use('/auth', authRouter);
router.use('/files', fileRouter);


module.exports = router;
