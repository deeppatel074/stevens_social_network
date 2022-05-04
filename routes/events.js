const express = require('express');
const router = express.Router();
const valid = require("../data/valid");
const upload = require('../config/multer');
const xss = require('xss');


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


// will render events Create page
router.get('/create', async (req, res) => {
    // if (req.session.user) {
    return res.status(200).render("events/eventsCreate", {
        title: "Create Events",
        logged: true
    });
    // } else {
    //     return res.redirect('/');
    // }
});

// will render events detail page
router.get('/:id', async (req, res) => {
    // if (req.session.user) {
    return res.status(200).render("events/eventsDetail", {
        title: "Events",
        logged: true
    });
    // } else {
    //     return res.redirect('/');
    // }
});



module.exports = router;