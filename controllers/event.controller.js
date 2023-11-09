const { BadRequestError, NotFoundError } = require('../errors');
const { getEvent,listCurrentEvents, listPastEvents,listFutureEvents,addEvent, updateEvent,deleteEvent,   } = require('../services/event.service');

const LIMIT_PER_PAGE = 10;

const EventsController = {
    listCurrent: async (req, res, next) => {
        try {
            const { curDate } = req.query;
            const events = await listCurrentEvents({ curDate});
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

    listPast: async (req, res, next) => {
        try {
            const { curDate } = req.query;
            const events = await listPastEvents({ curDate});
            res.json({
                message: 'Fetched past events successfully',
                payload: {
                    events,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    listFuture: async (req, res, next) => {
        try {
            const { curDate } = req.query;
            const events = await listFutureEvents({ curDate});
            res.json({
                message: 'Fetched future events successfully',
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
            
            if (!event || !event.title || !event.start_time || !event.end_time) {
                throw new BadRequestError('title, Start time and end time are required for creating a post.');
            }
    
            const newEvent = await addEvent({ event });
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
            const event = await getEvent({ eventID: id });
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

    update: async (req, res, next) => {
        try {

            const { event } = req.body;
            const { id } = req.params;
            const updatedEvent = await updateEvent({event, id });
            res.json({
                message: 'Updated event successfully',
                payload: {
                    post: updatedEvent,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const { event} = req.body;
            await deleteEvent({ event });
            res.json({
                message: 'Deleted event successfully',
                payload: {},
            });
        } catch (error) {
            next(error);
        }
    },

    
    
};

module.exports = EventsController;
