const express = require('express');
const router = express.Router();
const valid = require("../data/valid");
const { bannerUpload } = require('../config/multer');
const xss = require('xss');
const eventData = require("../data/events");

// will render events list
router.get('/', async (req, res) => {
    if (req.session.user) {
        return res.status(200).render("events/eventsList", {
            title: "Events",
            logged: true
        });
    } else {
        return res.redirect('/');
    }
});


// will Create Events
router.post('/create', bannerUpload.single("bannerUrl"), async (req, res) => {
    if (req.session.user) {

        const eventsPostData = req.body;
        let bannerPic = req.file.filename;
        try {
            eventsPostData.title = await valid.checkString(eventsPostData.title, "title");
            eventsPostData.description = await valid.checkString(eventsPostData.description, "description");
            await valid.validateEventDate(eventsPostData.eventDate);
            eventsPostData.participantLimit = await valid.validateLimit(eventsPostData.participantLimit);
            eventsPostData.perks = await valid.checkString(eventsPostData.perks, "perks");
            eventsPostData.location = await valid.checkString(eventsPostData.location, "location");

            const { title, description, eventDate, location, perks, participantLimit } = eventsPostData
            let event = await eventData.createEvents(xss(title), xss(description), xss(eventDate), xss(location), xss(perks), xss(participantLimit), xss(bannerPic), xss(req.session.user._id));
            if (event.eventInserted == true) {
                return res.redirect('/events/1234');

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
        return res.status(200).render("events/myevents", {
            title: "Create Events",
            logged: true
        });
    } else {
        return res.redirect('/');
    }
});

// will render events detail page
router.get('/:id', async (req, res) => {
    if (req.session.user) {
        return res.status(200).render("events/eventsDetail", {
            title: "Events",
            logged: true
        });
    } else {
        return res.redirect('/');
    }
});



module.exports = router;