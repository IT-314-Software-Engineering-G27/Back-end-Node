const express = require('express');
const authRouter = require("./auth.route");
const userRouter = require("./user.route");
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

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/files', fileRouter);


module.exports = router;
