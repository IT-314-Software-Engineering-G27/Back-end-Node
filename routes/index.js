const express = require('express');
const authRouter = require("./auth.route");
const individualRouter = require("./individual.route");
const organizationRouter = require('./organization.route');
const jobProfileRouter = require('./jobProfile.route');
const fileRouter = require("./file.route");
const connectionRouter = require("./connection.route");
const jobApplicationRouter = require("./jobApplication.route");
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
router.use('/job-profiles', jobProfileRouter);
router.use('/connections', connectionRouter);
router.use('/job-applications', jobApplicationRouter);


module.exports = router;
