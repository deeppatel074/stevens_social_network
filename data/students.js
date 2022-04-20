const axios = require("axios");
const mongoCollections = require('../config/mongoCollections.js');
const students = mongoCollections.students;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const valid = require("../tasks/valid");

module.exports = {
    async createStudent(firstName, lastName, email, password, phoneNumber, profileUrl) {
        firstName = await valid.checkString(firstName, "firstName");
        lastName = await valid.checkString(lastName, "lastName");
        await valid.validatePhoneNumber(phoneNumber);
        email = await valid.validateEmail(email);
        await valid.validatePassword(password);
        await valid.checkString(profileUrl, "Profile Picture");
        // let utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        const hash = await bcrypt.hash(password, saltRounds);
        let newStudent = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hash,
            phoneNumber: phoneNumber,
            profileUrl: profileUrl,
            eventRegistered: [],
            status: 1,
            createdAt: new Date()
        };
        const studentsCollection = await students();
        const student = await studentsCollection.findOne({ email: email });
        if (student) {
            throw `Student email ID  is already being used`;
        }
        const insertInfo = await studentsCollection.insertOne(newStudent);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            return ({ studentInserted: false })
        }
        else {
            return ({ studentInserted: true })
        }
    },

    async checkStudent(email, password) {
        email = await valid.validateEmail(email);
        await valid.validatePassword(password);
        const studentsCollection = await students();
        const student = await studentsCollection.findOne({ email: email });
        if (!student) {
            throw `Either the email or password is invalid`;
        }
        let comparePassword = false;
        comparePassword = await bcrypt.compare(password, student.password);
        if (comparePassword) {
            return { authenticated: true };
        } else {
            throw `Either the email or password is invalid`;
        }
    },

    async getProfileUrl(email) {
        const studentsCollection = await students();
        const student = await studentsCollection.findOne({ email: email });
        if (student) {
            student.profileUrl = student.profileUrl.replace(/ \ /, "/");
            return (student.profileUrl)
        } else {
            throw `Couldn't find student`
        }

    }

}