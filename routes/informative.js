const express = require('express');
const router = express.Router();
const xss = require('xss');
const valid = require('../data/valid');
const informativeData = require('../data/informative');

router.get('/', async (req, res) => {
    if (req.session.user) {
        try {
            return res.status(200).render("informative/discussionList", {
                title: "Informative",
                logged: true,
            });
        } catch (e) {

        }


    } else {
        return res.redirect('/');
    }
});

router.get('/post', async (req, res) => {
    if (req.session.user) {
        let search = req.query.search;
        let my = req.query.my;
        let studentId = req.session.user._id;
        const posts = await informativeData.getAllPost(search, my, studentId);
        return res.status(200).json(posts);
    } else {
        return res.redirect('/');
    }
});

router.post('/create', async (req, res) => {
    if (req.session.user) {
        // console.log("Here In Create ", req.session.user);
        let { title, description } = req.body;
        let createdBy = req.session.user._id;
        try {
            // console.log("inside Try", req.body);
            title = await valid.checkString(title, 'title');
            description = await valid.checkString(description, 'description');
            createdBy = await valid.checkSessionId(createdBy);
            // console.log("inside Try 1.1");
            let post = await informativeData.createPost(xss(title), xss(description), xss(createdBy));
            if (post) {
                return res.redirect('/informative');

            } else {
                return res.status(500).json({ Error: "Internal Server Error" });

            }
        } catch (e) {
            return res.status(400).render("informative/discussionList", {
                title: "Errors",
                hasErrorsSign: true,
                errors: e,
                post: { title, description }
            });

        }
    } else {
        return res.redirect('/');
    }
});


module.exports = router;