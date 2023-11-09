const { NotFoundError, ForbiddenError } = require('../errors');
const EventModel = require('../models/event.model');
const RegistrationModel = require('../models/registration.model');
const OrganizationModel = require('../models/organization.model');

async function createEvent({ event }) {
    return await EventModel.create(event);
}

async function listAllEvents({ query, page, limit }) {
    const events = await EventModel.find({
        title: {
            $regex: `${query}`, $options: 'i',
        },
    }, {
        _id: 1,
    }).sort({ registrations: -1 }).skip(page * limit).limit(limit).exec();
    return events.map((event) => event._id);
};

async function listCurrentEvents({ query, page, limit }) {
    const events = await EventModel.find({
        start_time: {
            $lt: new Date(),
        },
        end_time: {
            $gt: new Date(),
        },
        title: {
            $regex: `${query}`, $options: 'i',
        },
    }, {
        _id: 1,
    }).sort({ registrations: -1 }).skip(page * limit).limit(limit).exec();
    return events.map((event) => event._id);
}

async function listPastEvents({ query, page, limit }) {
    const events = await EventModel.find({
        end_time: {
            $lt: new Date(),
        },
        title: {
            $regex: `${query}`, $options: 'i',
        },
    }, {
        _id: 1,
    }).sort({ registrations: -1 }).skip(page * limit).limit(limit).exec();
    return events.map((event) => event._id);
}

async function listFutureEvents({ query, page, limit }) {
    const events = await EventModel.find({
        start_time: {
            $gt: new Date(),
        },
        title: {
            $regex: `${query}`, $options: 'i',
        },
    }, {
        _id: 1,
    }).sort({ registrations: -1 }).skip(page * limit).limit(limit).exec();
    return events.map((event) => event._id);
}

async function getEvent({ eventId }) {
    return await EventModel.findById(eventId, {
        registrations: 0,
    }).exec();
}

async function getEventBasic({ eventId }) {
    return await EventModel.findById(eventId, {
        registrations: 0,
        description: 0,
        requirements: 0,
    });
}

async function getEventRegistrations({ eventId }) {
    const event = (await EventModel.findById(eventId, {
        registrations: 1,
    }).exec()).toJSON();
    return event.registrations;
}

async function getEventStatus({ eventId, organizationId }) {
    const { registrations } = await OrganizationModel.findById(organizationId, {
        registrations: 1,
    }).populate({
        path: 'registrations',
        select: 'event',
    }).exec();
    const registration = registrations.find((registration) => registration.event.toString() === eventId);
    if (!registration) {
        return {
            status: 'unregistered',
        }
    }
    return {
        status: 'registered',
        _id: registration._id,
    }
}

async function registerForEvent({ eventId, organizationId, registration: {
    title, description, images
} }) {

    const { last_registration_date } = await EventModel.findById(eventId, {
        last_registration_date: 1,
    }).exec();
    if (last_registration_date < new Date()) {
        throw new ForbiddenError('Registration for this event has ended');
    };

    const registration = await RegistrationModel.create({
        title,
        description,
        event: eventId,
        organization: organizationId,
        images,
    });
    await EventModel.findByIdAndUpdate(eventId, {
        $push: {
            registrations: registration._id,
        },
    }).exec();
    await OrganizationModel.findByIdAndUpdate(organizationId, {
        $push: {
            registrations: registration._id,
        },
    }).exec();
    return registration;
};

async function deregisterForEvent({ eventId, organizationId }) {
    const registration = await getEventStatus({ eventId, organizationId });
    if (!registration._id) {
        throw new NotFoundError('You are not registered for this event');
    }
    await EventModel.findByIdAndUpdate(eventId, {
        $pull: {
            registrations: registration._id,
        },
    }).exec();
    await OrganizationModel.findByIdAndUpdate(organizationId, {
        $pull: {
            registrations: registration._id,
        },
    }).exec();
    await RegistrationModel.findByIdAndDelete(registration._id).exec();
};


async function updateEvent({ event, eventId }) {
    const updatedEvent = await EventModel.findByIdAndUpdate(eventId, event).exec();
    return updatedEvent;
}

async function deleteEvent({ eventId }) {
    return await EventModel.findByIdAndDelete(eventId).exec();
}

module.exports = {
    getEvent,
    listAllEvents,
    listCurrentEvents,
    getEventStatus,
    getEventBasic,
    getEventRegistrations,
    registerForEvent,
    deregisterForEvent,
    listPastEvents,
    listFutureEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};
