const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections.js');
const events = mongoCollections.events;
const valid = require("./valid");
const students = require('./students')

module.exports = {
    async createEvents(title, description, eventDate, location, perks, participantLimit, bannerUrl, userId) {
        title = await valid.checkString(title, "title");
        description = await valid.checkString(description, "description");
        await valid.validateEventDate(eventDate);
        participantLimit = await valid.validateLimit(participantLimit);
        bannerUrl = await valid.checkString(bannerUrl, "bannerUrl");
        location = await valid.checkString(location, "location");
        perks = await valid.checkString(perks, "perks");

        let isUser = await students.getStudentById(userId);
        if (!isUser) {
            throw "User Not Found!!!";
        }
        let newEvent = {
            title: title,
            description: description,
            eventDate: new Date(eventDate),
            eventLocation: location,
            participants: [],
            participantLimit: participantLimit,
            bannerUrl: bannerUrl,
            perks: perks,
            comments: [],
            createdBy: ObjectId(userId),
            createdAt: new Date(),
            status: 1
        }

        const eventCollection = await events();
        const insertInfo = await eventCollection.insertOne(newEvent);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw `Event couldn't be created`;
        }
        else {
            return ({ eventInserted: true })
        }
    }
};