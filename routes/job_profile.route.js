const express = require('express');
const jobProfileRouter = express.Router();
const JobProfileController = require('../controllers/job_profile.controller');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');

jobProfileRouter.get('/', JobProfileController.list);
jobProfileRouter.delete('/', tokenToIDMiddleware, JobProfileController.delete);
jobProfileRouter.get('/:id', JobProfileController.findProfile);
jobProfileRouter.get('/:id', JobProfileController.listApplicants);

module.exports = jobProfileRouter;