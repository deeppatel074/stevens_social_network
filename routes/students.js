const express = require('express');
const router = express.Router();
const valid = require("../data/valid");
const studentData = require("../data/students");
const { upload } = require('../config/multer');
const xss = require('xss');

router
    .route('/')
    .get(async (req, res) => {
        try {
            if (req.session.user) {
                res.render("events/eventsList", {
                    title: "Events",
                    logged: true
                });
                return;
            }
            else {
                res.render("students/login", {
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
            res.status(400).render("students/login", {
                title: "Errors",
                hasErrors: true,
                errors: e,
                email: email,
                password: password
            });
            return;
        }

        try {
            let student = await studentData.checkStudent(xss(email), xss(password));
            if (student.authenticated == true) {
                req.session.user = { _id: student.data._id.toString(), email: email };
                return res.redirect('/events');
            }
            if (student.authenticated == false && !e) {
                res.status(500).json(
                    { Errors: "Internal Server Error" }
                );
                return;

            }
        } catch (e) {
            res.status(400).render("students/login", {
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
                res.status(200).render("students/signup", {
                    title: "Sign up"
                });
                return;
            } else {
                return res.redirect('/events');
            }

        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    })

    .post(upload.single("profileUrl"), async (req, res) => {

        const studentPostData = req.body;
        let profilePic;

        try {
            studentPostData.firstName = await valid.checkString(studentPostData.firstName, "firstName");
            studentPostData.lastName = await valid.checkString(studentPostData.lastName, "lastName");
            studentPostData.email = await valid.validateEmail(studentPostData.email);
            await valid.validatePassword(studentPostData.password);
            await valid.validateConfirmPassword(studentPostData.password, studentPostData.confirmPassword);
            await valid.validatePhoneNumber(studentPostData.phoneNumber);
            if (req.file) {
                if (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/png") {
                    profilePic = req.file.filename;
                } else {
                    throw "Profile image should be jpeg, png"
                }
            } else {
                throw "Profile Picture is required"
            }

        } catch (e) {
            res.status(400).render("students/signup", {
                title: "Errors",
                hasErrorsSign: true,
                errors: e,
                logged: true,
                studentPostData: studentPostData
            });
            return;
        }

        try {
            // const {firstName, lastName,email,password,phoneNumber,profileUrl} =  studentPostData
            let student = await studentData.createStudent(xss(studentPostData.firstName), xss(studentPostData.lastName), xss(studentPostData.email), xss(studentPostData.password), xss(studentPostData.phoneNumber), xss(profilePic));
            if (student != null || student != undefined) {
                res.redirect('/events');
                return;
            } if (student.studentInserted == false && !e) {
                res.status(500).json({ Error: "Internal Server Error" });
                return;
            }
        } catch (e) {
            res.status(400).render("students/signup", {
                title: "Errors",
                hasErrorsSign: true,
                errors: e,
                logged: true,
                studentPostData: studentPostData
            });
            return;
        }
    });

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
                    res.redirect('/')
                    return;

                }
            });
        } else {
            res.end()
            return;
        }
    })

router
    .route("/myProfile")
    .get(async (req, res) => {
        try {
            if (!req.session.user) {
                res.redirect('/');
                return;
            } else {
                let profileId = req.session.user._id;
                profileId = await valid.id(profileId);
                let profileData = await studentData.getStudentById(xss(profileId));
                if (profileData) {
                    return res.status(200).render("myProfile/myProfile", {
                        title: "My Profile",
                        studentPostData: profileData,
                        logged: true
                    });
                } else {
                    res.status(500).json({ Error: "Internal Server Error" });
                    return;
                }
            }
        } catch (e) {
            res.status(500).json({ error: e });
            return;
        }
    })
    .post(async (req, res) => {
        let profileId = req.session.user._id;
        let profileData = req.body;
        try {
            if (!req.session.user) {
                res.redirect('/');
                return;
            } else {
                await valid.validatePhoneNumber(profileData.phoneNumber);
                profileData.firstName = await valid.checkString(profileData.firstName, 'firstName');
                profileData.lastName = await valid.checkString(profileData.lastName, 'lastName');
                profileId = await valid.id(profileId);
                profileData.email = await valid.validateEmail(profileData.email);
                let updateProfile = await studentData.updateStudent(xss(profileId), xss(profileData.firstName), xss(profileData.lastName), xss(profileData.email), xss(profileData.phoneNumber));
                if (updateProfile.studentInserted == true) {
                    res.redirect('/myProfile');
                    return;
                } else if (updateProfile.studentInserted == false) {
                    profileData = await studentData.getStudentById(xss(profileId));
                    res.status(400).render("myProfile/myProfile", {
                        title: "Errors",
                        hasErrors: true,
                        logged: true,
                        errors: "Internal Server Error",
                        studentPostData: profileData
                    });
                    return;
                }
            }
        } catch (e) {
            profileData = await studentData.getStudentById(xss(profileId));
            res.status(400).render("myProfile/myProfile", {
                title: "Errors",
                hasErrors: true,
                errors: e,
                logged: true,
                studentPostData: profileData
            });
            return;
        }
    });

module.exports = router;



