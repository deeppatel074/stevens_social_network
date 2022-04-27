const express = require('express');
const router = express.Router();
const xss = require('xss');

router.get('/', async (req, res) => {
    if (req.session.user) {
        return res.status(200).render("informative/discussionList", {
            title: "Informative",
            logged: true
        });
    } else {
        return res.redirect('/');
    }
});


module.exports = router;