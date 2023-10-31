const express = require('express');
const jobApplicationRouter = express.Router();
const JobApplicationController = require('../controllers/jobApplication.controller');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');
const { jobApplicationMiddleware } = require('../middlewares/jobApplication.middleware');

jobApplicationRouter.get('/', tokenToIDMiddleware, JobApplicationController.list);
jobApplicationRouter.get('/:id', tokenToIDMiddleware, jobApplicationMiddleware, JobApplicationController.get);
jobApplicationRouter.get('/:id/basic', tokenToIDMiddleware, jobApplicationMiddleware, JobApplicationController.getBasic);
jobApplicationRouter.post('/:id/reject', tokenToIDMiddleware, jobApplicationMiddleware, JobApplicationController.reject);
jobApplicationRouter.post('/:id/accept', tokenToIDMiddleware, jobApplicationMiddleware, JobApplicationController.accept);
jobApplicationRouter.put('/:id', tokenToIDMiddleware, jobApplicationMiddleware, JobApplicationController.update);
jobApplicationRouter.delete('/:id', tokenToIDMiddleware, jobApplicationMiddleware, JobApplicationController.delete);

module.exports = jobApplicationRouter;