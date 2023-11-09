const { BadRequestError, NotFoundError } = require('../errors');
const eventModel = require('../models/event.model');
const { uploadFile, removeFile } = require('./file.service');

async function listCurrentEvents({curDate}){
    return(await eventModel.find({
        start_time: {
            $lt : new Date(curDate),
        },
        end_time: {
            $gt: new Date(curDate),
        },
    }));
}

async function listPastEvents({curDate}){
    return(await eventModel.find({
        end_time: {
            $lt: new Date(curDate),
        },
    }));
}

async function listFutureEvents({curDate}){
    return(await eventModel.find({
        start_time: {
            $gt: new Date(curDate),
        },
    }));
}

async function getEvent({ event }) {
    return (await eventModel.findById(event._id).exec());
}


async function addEvent({event}){

	try {
		return await eventModel.create({event});
		
	} catch (err) {
		if (err.name === "MongoError" && err.code === 11000) {
			throw new ForbiddenError("Event already exists");
		}
		throw err;
	}
}

async function updateEvent({event}){
	try{
		const updateEvent = await eventModel.findByIdAndUpdate(event, event._id).exec();

	return event;
		}catch (error) {
			throw error;
		}
}

async function deleteEvent({event})
{
	return await eventModel.findByIdAndDelete(event._id).exec();
}

module.exports = {
    getEvent,
    listCurrentEvents,
    listPastEvents,
    listFutureEvents,
    addEvent,
    updateEvent,
    deleteEvent,  
};
