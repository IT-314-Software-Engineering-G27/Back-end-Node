const { BadRequestError, ForbiddenError } = require('../errors');
const { getEvent, listCurrentEvents, listAllEvents, listPastEvents, listFutureEvents, createEvent, updateEvent, deleteEvent, registerForEvent, listRegistrations, deregisterForEvent, getEventStatus, getEventBasic } = require('../services/event.service');
const { transformInputToEvent, validateEvent } = require('../services/utils/event.util');
const { transformInputToRegistration } = require('../services/utils/registration.util');
const LIMIT_PER_PAGE = 10;

const EventsController = {
    list: async (req, res, next) => {
        try {
            const { type, query, page } = req.query;
            var events;
            switch (type) {
                case 'past':
                    events = await listPastEvents({ query: query ?? "", page: Number(page) || 0, limit: LIMIT_PER_PAGE });
                    break;
                case 'future':
                    events = await listFutureEvents({ query: query ?? "", page: Number(page) || 0, limit: LIMIT_PER_PAGE });
                    break;
                case 'current':
                    events = await listCurrentEvents({ query: query ?? "", page: Number(page) || 0, limit: LIMIT_PER_PAGE });
                    break;
                default:
                    events = await listAllEvents({ query: query ?? "", page: Number(page) || 0, limit: LIMIT_PER_PAGE });
                    break;
            };
            res.json({
                message: 'Fetched events successfully',
                payload: {
                    events,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const { event } = req.body;
            if (!event) throw new BadRequestError('Event details not provided');
            validateEvent({ event });
            const transformedEvent = transformInputToEvent({ event });
            const newEvent = await createEvent({ event: transformedEvent });
            res.json({
                message: 'Added event successfully',
                payload: {
                    event: newEvent,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    get: async (req, res, next) => {
        try {
            const { id } = req.params;
            const event = await getEvent({ eventId: id });
            res.json({
                message: 'Fetched event successfully',
                payload: {
                    event,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    getBasic: async (req, res, next) => {
        try {
            const { id } = req.params;
            const event = await getEventBasic({ eventId: id });
            res.json({
                message: 'Fetched event successfully',
                payload: {
                    event,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    listRegistrations: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { query, page } = req.query;
            const registrations = await listRegistrations({ eventId: id, query: query ?? "", page: Number(page) || 0, limit: LIMIT_PER_PAGE });
            res.json({
                message: 'Fetched event registrations successfully',
                payload: {
                    registrations,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const { event } = req.body;
            if (!event) throw new BadRequestError('Event details not provided');
            validateEvent({ event });
            const { id } = req.params;
            const transformedEvent = transformInputToEvent({ event });
            const updatedEvent = await updateEvent({ event: transformedEvent, eventId: id });
            res.json({
                message: 'Updated event successfully',
                payload: {
                    event: updatedEvent,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const { id } = req.params;
            await deleteEvent({ eventId: id });
            res.json({
                message: 'Deleted event successfully',
                payload: {},
            });
        } catch (error) {
            next(error);
        }
    },
    getStatus: async (req, res, next) => {
        try {
            const { id } = req.params;
            const organization = req.user.organization;
            const registration = await getEventStatus({ eventId: id, organizationId: organization });
            res.json({
                message: 'Fetched event status successfully',
                payload: {
                    registration
                },
            });
        } catch (error) {
            next(error);
        }
    },
    register: async (req, res, next) => {
        try {
            const { id } = req.params;
            const organization = req.user.organization;
            if (!organization) throw new ForbiddenError('You are not authorized to register for this event');
            const { registration } = req.body;
            if (!registration) throw new BadRequestError('Registration details not provided');
            const transformedRegistration = transformInputToRegistration({ registration });
            const newRegistration = await registerForEvent({ eventId: id, organizationId: organization, registration: transformedRegistration });
            res.json({
                message: 'Registered for event successfully',
                payload: {
                    registration: newRegistration,
                },
            });
        }
        catch (error) {
            next(error);
        }
    },
    deregister: async (req, res, next) => {
        try {
            const { id } = req.params;
            const organization = req.user.organization;
            await deregisterForEvent({ eventId: id, organizationId: organization });
            res.json({
                message: 'Deregistered for event successfully',
                payload: {},
            });
        }
        catch (error) {
            next(error);
        }
    }
};

module.exports = EventsController;
