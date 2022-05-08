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
            return res.status(404).render("errors/errors", {
                title: "Error",
                logged: true,
                error: "Page Not Found",
                code: 404
            });
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
        try {
            const posts = await informativeData.getAllPost(xss(search), xss(my), xss(studentId));
            return res.status(200).json(posts);
        } catch (e) {
            return res.status(404).render("errors/errors", {
                title: "Error",
                logged: true,
                error: "Posts Not Found",
                code: 404
            });
        }
    } else {
        return res.redirect('/');
    }
});

router.get('/post/:id', async (req, res) => {
    if (req.session.user) {
        try {
            let id = req.params.id;
            id = await valid.id(id);
            let postDetails = await informativeData.getPost(xss(id));
            return res.status(200).render("informative/discussionDetail", {
                title: "Post",
                logged: true,
                postDetails: postDetails
            });
        } catch (e) {
            return res.status(404).render("errors/errors", {
                title: "Error",
                logged: true,
                error: "Post Not Found",
                code: 404
            });
        }
    } else {
        return res.redirect('/');
    }
});

router.post('/post/:id', async (req, res) => {
    if (req.session.user) {
        try {
            let id = req.params.id;
            let comment = req.body.comment;
            let userId = req.session.user._id
            comment = await valid.checkString(comment, 'comment');
            userId = await valid.checkSessionId(userId);
            id = await valid.id(id);
            let postDetails = await informativeData.addCommentsToPost(xss(id), xss(comment), xss(userId));
            if (postDetails) {
                return res.status(200).json({
                    isSuccess: true
                });
            }
        } catch (e) {
            return res.status(400).json({
                isError: true,
                errors: e
            });
        }
    } else {
        return res.redirect('/');
    }
});

router.post('/create', async (req, res) => {
    if (req.session.user) {
        let { title, description } = req.body;
        let createdBy = req.session.user._id;
        try {
            title = await valid.checkString(title, 'title');
            description = await valid.checkString(description, 'description');
            createdBy = await valid.checkSessionId(createdBy);
            let post = await informativeData.createPost(xss(title), xss(description), xss(createdBy));
            if (post != null || post != undefined) {
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