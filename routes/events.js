const express = require('express');
const router = express.Router();
const valid = require("../data/valid");
const upload = require('../config/multer');
const xss = require('xss');

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

module.exports = router;