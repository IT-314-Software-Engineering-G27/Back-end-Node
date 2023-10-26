const express = require('express');
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

module.exports = router;
