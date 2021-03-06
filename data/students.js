const mongoCollections = require('../config/mongoCollections.js');
const students = mongoCollections.students;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const valid = require("./valid");

module.exports = {
    async createStudent(firstName, lastName, email, password, phoneNumber, profileUrl) {
        firstName = await valid.checkString(firstName, "firstName");
        lastName = await valid.checkString(lastName, "lastName");
        email = await valid.validateEmail(email);
        await valid.validatePassword(password);
        await valid.validatePhoneNumber(phoneNumber);
        await valid.checkString(profileUrl, "Profile Picture");
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
        const student = await studentsCollection.findOne({ email: { '$regex': `^${email}$`, '$options': 'i' } });
        if (student) {
            throw `Student email ID  is already being used`;
        }
        const insertInfo = await studentsCollection.insertOne(newStudent);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            return null
        }
        else {
            const newId = insertInfo.insertedId.toString();
            const student = await this.getStudentById(newId.toString());
            return student
        }
    },

    async updateStudent(profileId, firstName, lastName, email, phoneNumber) {
        firstName = await valid.checkString(firstName, "firstName");
        lastName = await valid.checkString(lastName, "lastName");
        await valid.validatePhoneNumber(phoneNumber);
        profileId = await valid.id(profileId);
        email = await valid.validateEmail(email);

        const studentsCollection = await students();
        const student = await studentsCollection.findOne({ email: { '$regex': `^${email}$`, '$options': 'i' } });
        if (student) {
            if (student._id.toString() !== profileId.toString()) {
                throw `Student email ID  is already being used`;
            }
        }
        const updateProfile = await studentsCollection.updateOne({ _id: ObjectId(profileId) }, { $set: { firstName: firstName, lastName: lastName, email: email, phoneNumber: phoneNumber } });
        if (!updateProfile.acknowledged) {
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
        const student = await studentsCollection.findOne({ email: { '$regex': `^${email}$`, '$options': 'i' } });
        if (!student) {
            throw `Either the email or password is invalid`;
        }
        let comparePassword = false;
        comparePassword = await bcrypt.compare(password, student.password);
        if (comparePassword) {
            return { authenticated: true, data: student };
        } else {
            throw `Either the email or password is invalid`;
        }
    },

    async getProfileUrl(email) {
        email = await valid.validateEmail(email);
        const studentsCollection = await students();
        const student = await studentsCollection.findOne({ email: { '$regex': `^${email}$`, '$options': 'i' } });
        if (student) {
            student.profileUrl = student.profileUrl.replace(/ \ /, "/");
            return (student.profileUrl)
        } else {
            throw `Couldn't find student`
        }

    },
    async getStudentById(id) {
        id = await valid.id(id);
        const studentsCollection = await students();
        const student = await studentsCollection.findOne({ _id: ObjectId(id) });
        if (student) {
            return student;
        } else {
            throw 'User not registered';
        }
    }
}