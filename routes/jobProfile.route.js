const express = require('express');
const jobProfileRouter = express.Router();
const JobProfileController = require('../controllers/jobProfile.controller');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');
const { jobProfileMiddleware } = require('../middlewares/jobProfile.middleware');

jobProfileRouter.get('/', JobProfileController.list);
jobProfileRouter.post('/', tokenToIDMiddleware, JobProfileController.create);
jobProfileRouter.get('/:id', JobProfileController.get);
jobProfileRouter.get('/:id/basic', JobProfileController.getBasic);
jobProfileRouter.get('/:id/status', tokenToIDMiddleware, JobProfileController.getStatus);
jobProfileRouter.post('/:id/apply', tokenToIDMiddleware, JobProfileController.apply);
jobProfileRouter.get('/:id/applications', tokenToIDMiddleware, jobProfileMiddleware, JobProfileController.getApplications);
jobProfileRouter.put('/:id', tokenToIDMiddleware, jobProfileMiddleware, JobProfileController.update);
jobProfileRouter.delete('/:id', tokenToIDMiddleware, jobProfileMiddleware, JobProfileController.delete);

module.exports = jobProfileRouter;