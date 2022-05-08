const express = require('express');
const router = express.Router();
const valid = require("../data/valid");
const { bannerUpload } = require('../config/multer');
const xss = require('xss');
const eventData = require("../data/events");

// will render events list
router.get('/', async (req, res) => {
    if (req.session.user) {
        let events = await eventData.getAllActiveEvents();
        // return res.json(events);
        return res.status(200).render("events/eventsList", {
            title: "Events",
            logged: true,
            events: events
        });
    } else {
        return res.redirect('/');
    }
});

router.get('/search', async (req, res) => {
    if (req.session.user) {
        let searchTerm = req.query.searchTerm;
        try {
            let events = await eventData.getAllActiveEvents(xss(searchTerm));
            return res.status(200).json(events);
        } catch (e) {
            return res.status(400).json(e);
        }
    } else {
        return res.redirect('/');
    }
});


// will Create Events
router.post('/create', bannerUpload.single("bannerUrl"), async (req, res) => {
    if (req.session.user) {

        const eventsPostData = req.body;
        let bannerPic;
        try {
            eventsPostData.title = await valid.checkString(eventsPostData.title, "title");
            eventsPostData.description = await valid.checkString(eventsPostData.description, "description");
            await valid.validateEventDate(eventsPostData.eventDate);
            eventsPostData.participantLimit = await valid.validateLimit(eventsPostData.participantLimit);
            eventsPostData.perks = await valid.checkString(eventsPostData.perks, "perks");
            eventsPostData.location = await valid.checkString(eventsPostData.location, "location");
            if (req.file) {
                if (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/png") {
                    bannerPic = req.file.filename;
                } else {
                    throw "Banner image should be jpeg, png"
                }
            } else {
                throw "Profile Picture is required"
            }

            const { title, description, eventDate, location, perks, participantLimit } = eventsPostData
            let event = await eventData.createEvents(xss(title), xss(description), xss(eventDate), xss(location), xss(perks), xss(participantLimit), xss(bannerPic), xss(req.session.user._id));
            if (event.eventInserted == true) {
                return res.redirect(`/events/${event._id}`);

            } else {
                return res.status(500).json({ Error: "Internal Server Error" });
            }
        } catch (e) {
            return res.status(400).render("events/myevents", {
                title: "Errors",
                hasErrorsEventRegister: true,
                errors: e,
                eventsPostData: eventsPostData,
                logged: true
            });
        }
    } else {
        return res.redirect('/');
    }
});

router.get('/myevents', async (req, res) => {
    if (req.session.user) {
        let userId = req.session.user._id
        userId = await valid.id(userId);
        let data = await eventData.getMyEvents(xss(userId));
        return res.status(200).render("events/myevents", {
            title: "Create Events",
            logged: true,
            data: data
        });
    } else {
        return res.redirect('/');
    }
});

router.get('/stats', async (req, res) => {
    if (req.session.user) {
        let userId = req.session.user._id
        userId = await valid.id(userId);
        let data = await eventData.getMyEventsForCal(xss(userId));
        return res.status(200).json(data)
    } else {
        return res.redirect('/');
    }
});
// will render events detail page
router.get('/:id', async (req, res) => {
    if (req.session.user) {
        try {
            let id = req.params.id;
            id = await valid.id(id);

            let userId = req.session.user._id
            let data = await eventData.getEventDetail(xss(id), xss(userId));

            return res.status(200).render("events/eventsDetail", {
                title: "Events",
                logged: true,
                data: data
            });
        } catch (e) {
            // return res.json(e);
            return res.status(404).render("errors/errors", {
                title: "Error",
                logged: true,
                error: "Events Not Found",
                code: 404
            });
        }
    } else {
        return res.redirect('/');
    }
});

router.delete('/rsvp/:id', async (req, res) => {
    if (req.session.user) {
        try {
            let id = req.params.id;
            id = await valid.id(id);

            let userId = req.session.user._id
            userId = await valid.id(userId);
            // let data = await eventData.getEventDetail(id, userId);
            let removeParticipant = await eventData.removeParticipant(xss(id), xss(userId));
            // return res.json(data);
            if (removeParticipant) {
                res.status(200).json({ deleted: true });
            } else {

            }
        } catch (e) {
            // return res.json(e);
            return res.status(404).render("errors/errors", {
                title: "Error",
                logged: true,
                error: e,
                code: 404
            });
        }
    } else {
        return res.redirect('/');
    }
});

router.get('/edit/:id', async (req, res) => {
    if (req.session.user) {
        try {
            let eventId = req.params.id;
            let userId = req.session.user._id;
            eventId = await valid.id(eventId);
            userId = await valid.id(userId);
            let data = await eventData.getEventById(xss(eventId), xss(userId));
            return res.status(200).render('events/eventEdit', {
                title: "Edit Event",
                logged: true,
                eventsPostData: data,
            });

        } catch (e) {
            return res.status(400).json(e);
        }
    } else {
        return res.redirect('/');
    }
});

router.post('/edit/:id', async (req, res) => {
    if (req.session.user) {
        let eventId = req.params.id;
        let userId = req.session.user._id;
        const eventsPostData = req.body;
        eventsPostData._id = eventId;
        eventsPostData.eventLocation = eventsPostData.location;

        try {
            eventsPostData.title = await valid.checkString(eventsPostData.title, "title");
            eventsPostData.description = await valid.checkString(eventsPostData.description, "description");
            await valid.validateEventDate(eventsPostData.eventDate);
            eventsPostData.participantLimit = await valid.validateLimit(eventsPostData.participantLimit);
            eventsPostData.perks = await valid.checkString(eventsPostData.perks, "perks");
            eventsPostData.location = await valid.checkString(eventsPostData.location, "location");
            eventId = await valid.id(eventId);
            userId = await valid.id(userId);
            const { title, description, eventDate, location, perks, participantLimit } = eventsPostData
            let event = await eventData.editEvents(xss(title), xss(description), xss(eventDate), xss(location), xss(perks), xss(participantLimit), xss(userId), xss(eventId));
            if (event == true) {
                return res.redirect(`/events/${eventId}`);
            } else {
                return res.status(400).render('events/eventEdit', {
                    title: "Edit Event",
                    logged: true,
                    errors: "Internal Server Error",
                    eventsPostData: eventsPostData,
                });
            }
        } catch (e) {
            return res.status(400).render('events/eventEdit', {
                title: "Edit Event",
                logged: true,
                errors: e,
                eventsPostData: eventsPostData,
            });
        }
    } else {
        return res.redirect('/');
    }
});

router.get('/chats/:id', async (req, res) => {
    if (req.session.user) {
        try {
            let id = req.params.id;
            id = await valid.id(id);

            let data = await eventData.getEventComment(xss(id));
            return res.status(200).json(data);

        } catch (e) {
            return res.status(400).json(e);
        }
    } else {
        return res.redirect('/');
    }
});

router.post('/chats/:id', async (req, res) => {
    if (req.session.user) {
        try {
            let id = req.params.id;
            id = await valid.id(id);
            let comment = req.body.comment;
            let userId = req.session.user._id;
            let data = await eventData.addCommentToEvent(xss(id), xss(comment), xss(userId));
            return res.status(200).json(data);
        } catch (e) {
            return res.status(400).json({ error: e });
        }
    } else {
        return res.redirect('/');
    }
});

router.post('/rsvp/:id', async (req, res) => {
    if (req.session.user) {
        try {
            let id = req.params.id;
            id = await valid.id(id);
            // let comment = req.body.comment;
            let userId = req.session.user._id;
            let data = await eventData.rsvpEvent(xss(id), xss(userId));
            if (data) {
                return res.redirect('/events/' + id);
            }
        } catch (e) {
            return res.status(400).json({ error: e });
        }
    } else {
        return res.redirect('/');
    }
});

router.delete('/:id', async (req, res) => {
    if (req.session.user) {

        let eventId = req.params.id;
        let userId = req.session.user._id;
        try {
            eventId = await valid.id(eventId);
            userId = await valid.id(userId);
        } catch (e) {
            return res.status(400).json({ "error": e });
        }
        try {

            const deletedInfo = await eventData.deleteEvent(xss(eventId), xss(userId));
            if (deletedInfo) {
                return res.status(200).json({ deleted: true });
            }
        } catch (e) {
            return res.status(500).json({ "error": e });
        }
    } else {
        return res.redirect('/');
    }
});


module.exports = router;