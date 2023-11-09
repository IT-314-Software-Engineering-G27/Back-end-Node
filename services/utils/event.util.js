const { BadRequestError } = require("../../errors");

function validateEvent({ event }) {
    const start_time_date = new Date(event.start_time);
    const end_time_date = new Date(event.end_time);
    if (!event.start_time || !event.end_time) throw new BadRequestError("Start time and end time are required");
    if (start_time_date > end_time_date) throw new BadRequestError("Start time cannot be after end time");
    if (start_time_date < Date.now()) throw new BadRequestError("Start time cannot be in the past");
    if (end_time_date < Date.now()) throw new BadRequestError("End time cannot be in the past");
}

function transformInputToEvent({ event }) {
    if (!event) throw new InternalServerError("Event is not defined");
    return {
        title: event.title,
        description: event.description,
        start_time: new Date(event.start_time),
        end_time: new Date(event.end_time),
        last_registration_date: new Date(event.last_registration_date || event.end_time),
        frequency: event.frequency,
        requirements: event.requirements,
    };
};

module.exports = {
    validateEvent,
    transformInputToEvent,
};