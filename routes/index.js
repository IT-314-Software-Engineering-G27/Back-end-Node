const express = require('express');
const authRouter = require("./auth.route");
const individualRouter = require("./individual.route");
const organizationRouter = require('./organization.route');
const jobProfileRouter = require('./job_profile.route');
const fileRouter = require("./file.route");
const connectionRouter = require("./connection.route");
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
router.use('/organizations', organizationRouter);
router.use('/auth', authRouter);
router.use('/files', fileRouter);
router.use('/job-profile', jobProfileRouter);
router.use('/connections', connectionRouter);


module.exports = router;
