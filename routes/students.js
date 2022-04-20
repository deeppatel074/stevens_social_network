const express = require('express');
const router = express.Router();
const valid = require("../tasks/valid")
const studentData = require("../data/students");
const upload = require('../config/multer')

router
    .route('/')
    .get(async (req, res) => {
        try {
            if (req.session.user) {
                res.redirect("/private");
                return;
            }
            else {
                res.render("pages/login", {
                    title: "Log In"
                });
                return;
            }
        } catch (e) {
            res.status(500).json({ Error: e })
            return;
        }
    });

//Log in

router
    .route("/login")
    .post(async (req, res) => {
        let { email, password } = req.body;
        try {
            email = await valid.validateEmail(email);
            await valid.validatePassword(password);
        } catch (e) {
            res.status(400).render("pages/login", {
                title: "Errors",
                hasErrors: true,
                errors: e,
                email: email,
                password: password
            });
            return;
        }

        try {
            let student = await studentData.checkStudent(email, password);
            if (student.authenticated == true) {
                req.session.user = { email: email };
                res.redirect('/private');
                return;
            }
            if (student.authenticated == false && !e) {
                res.status(500).json(
                    { Errors: "Internal Server Error" }
                );
                return;

            }
        } catch (e) {
            res.status(400).render("pages/login", {
                title: "Errors",
                hasErrors: true,
                errors: e
            });
            return;
        }
    });

//Sign Up

router
    .route("/signup")
    .get(async (req, res) => {
        try {
            if (!req.session.user) {
                res.status(200).render("pages/signup", {
                    title: "Sign up"
                });
                return;
            } else {
                res.status(200).redirect("/private");
                return;
            }

        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    })

    .post(upload.single("profileUrl"), async (req, res) => {
        const studentPostData = req.body;
        let profilePic = req.file.path;

        try {
            studentPostData.firstName = await valid.checkString(studentPostData.firstName, "firstName");
            studentPostData.lastName = await valid.checkString(studentPostData.lastName, "lastName");
            await valid.validatePhoneNumber(studentPostData.phoneNumber);
            studentPostData.email = await valid.validateEmail(studentPostData.email);
            await valid.validatePassword(studentPostData.password);
            await valid.validateConfirmPassword(studentPostData.password, studentPostData.confirmPassword);
        } catch (e) {
            res.status(400).render("pages/signup", {
                title: "Errors",
                hasErrorsSign: true,
                errors: e,
                studentPostData: studentPostData
            });
            return;
        }

        try {
            // const {firstName, lastName,email,password,phoneNumber,profileUrl} =  studentPostData
            let student = await studentData.createStudent(studentPostData.firstName, studentPostData.lastName, studentPostData.email, studentPostData.password, studentPostData.phoneNumber, profilePic);
            if (student.studentInserted == true) {
                res.redirect('/');
                return;
            } if (student.studentInserted == false && !e) {
                res.status(500).json({ Error: "Internal Server Error" });
                return;
            }
        } catch (e) {
            res.status(400).render("pages/signup", {
                title: "Errors",
                hasErrorsSign: true,
                errors: e,
                studentPostData: studentPostData
            });
            return;
        }
    });

//Redirect to home page 

router
    .route("/private")
    .get(async (req, res) => {
        if (req.session.user) {
            // let profile = await studentData.getProfileUrl(req.session.user.email);
            res.status(200).render("students/private", {
                email: req.session.user.email,
                title: "Private",

            })
            return;
        }
    })


//Logout

router
    .route("/logout")
    .get(async (req, res) => {
        if (req.session) {
            req.session.destroy(err => {
                if (err) {
                    res.status(400).send('Unable to log out')
                    return;
                } else {
                    res.render("students/logout", {
                        title: "Logout"
                    });
                    return;

                }
            });
        } else {
            res.end()
            return;
        }
    })

module.exports = router;



