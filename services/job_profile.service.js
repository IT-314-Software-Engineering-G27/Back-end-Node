const { BadRequestError } = require('../errors');
const JobProfileModel = require('../models/job_profile.model');

async function listJobProfiles({ query, page, limit }) {
    return (await JobProfileModel.find({ $text: { $search: query } }, {
        score: {
            $meta: 'textScore',
        },
        _id: 1,
    }).sort({
        score: {
            $meta: 'textScore',
        },
    }).skip(page * limit).limit(limit).exec()).map((jobProfile) => jobProfile._id);
}

async function addApplicant({id,ind_id}){
    jp=await JobProfileModel.findById(id,{
        job_applicant:1,
    }).exec();

    jp.unshift(ind_id);
}

async function findJobProfiles({id}) {
    return (await JobProfileModel.findById(id,{
        job_application:0,
    }).exec())
}

async function listApplicants({id}){
    return await JobProfileModel.findById(id,{
        job_applicant:1,
    }).exec();
}

async function getJobProfiles({id}){
    return await JobProfileModel.findById(id).exec();
}

async function deleteJobProfile({id}){
    return await JobProfileModel.findByIdAndDelete(id).exec();
}

module.exports = {
    listJobProfiles,
    addApplicant,
    findJobProfiles,
    listApplicants,
    getJobProfiles,
    deleteJobProfile,
};