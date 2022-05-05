const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections.js');
const events = mongoCollections.events;
const valid = require("./valid");
const students = require('./students');

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
            return ({ eventInserted: true, _id: insertInfo.insertedId.toString() })
        }
    },
    async getAllActiveEvents(searchParam) {
        let filter = {}
        if (searchParam) {
            filter.title = {
                $regex: `${searchParam}`,
                $options: 'i'
            };
            filter.description = {
                $regex: `${searchParam}`,
                $options: 'i'
            };
        }
        const eventCollection = await events();
        const eventDetail = await eventCollection.aggregate([
            {
                $match: { eventDate: { $gte: new Date() } }
            }, {
                $match: filter
            }, {
                $sort: {
                    eventDate: 1
                }
            }, {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    eventDate: { $dateToString: { format: "%m-%d-%Y", date: "$eventDate" } },
                    eventTime: { $dateToString: { format: "%H:%M", date: "$eventDate", timezone: "America/New_York" } },
                    eventLocation: 1,
                    perks: 1,
                    bannerUrl: 1,
                    totalParticipant: { $size: '$participants' },
                    participantLimit: 1,
                }
            }
        ]).toArray();
        console.log("Details", eventDetail);
        return eventDetail;
    },

    async getEventDetail(id, userId) {
        let isRegistered = false;
        let showButton = true;
        let showFull = false;
        id = await valid.id(id);
        // console.log("_Id", id);
        const eventCollection = await events();
        const event = await eventCollection.findOne({ _id: ObjectId(id) });
        if (!event) {
            throw 'Post not found!!';
        }
        if (event.createdBy.toString() !== userId.toString()) {
            if (event.participants.length > 0) {
                let isFound = event.participants.find(element => element.toString() === userId.toString());
                if (!isFound) {
                    isRegistered = false;
                    showButton = true;
                    if (event.participants.length === Number(event.participantLimit)) {
                        showButton = false;
                        showFull = true
                    }
                } else {
                    isRegistered = true;
                    showButton = false;
                }
            } else {
                isRegistered = false;
                showButton = true;
            }
        } else {
            isRegistered = true;
            showButton = false;
        }
        const eventDetail = await eventCollection.aggregate([
            {
                $match: { _id: ObjectId(id) }
            }, {
                $lookup:
                {
                    from: "students",
                    localField: "createdBy",
                    foreignField: "_id",
                    pipeline: [{
                        $project: {
                            _id: 0,
                            firstName: 1,
                            lastName: 1
                        }
                    }],
                    as: "createdBy"
                }
            }, {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    eventDate: { $dateToString: { format: "%m-%d-%Y", date: "$eventDate" } },
                    eventTime: { $dateToString: { format: "%H:%M", date: "$eventDate", timezone: "America/New_York" } },
                    eventLocation: 1,
                    perks: 1,
                    totalParticipant: { $size: '$participants' },
                    participantLimit: 1,
                    comments: 1,
                    createdBy: 1,
                }
            }
        ]).toArray();
        console.log("event Detail", eventDetail);
        if (eventDetail.length > 0) {
            eventDetail[0].isRegistered = isRegistered;
            eventDetail[0].showButton = showButton;
            eventDetail[0].showFull = showFull;
            if (eventDetail[0].comments.length > 0) {
                eventDetail[0].comments = await this.getEventComment(id);
            }
            console.log("event Detail", JSON.stringify(eventDetail[0]));
            return eventDetail[0];
        } else {
            throw "Event Not Found";
        }
    },
    async getEventComment(id) {
        id = await valid.id(id);
        // console.log("_Id", id);
        const eventCollection = await events();
        const eventDetail = await eventCollection.aggregate([
            {
                $match: { _id: ObjectId(id) }
            },
            { $unwind: "$comments" },
            {
                $lookup:
                {
                    from: "students",
                    localField: "comments.commentBy",
                    foreignField: "_id",
                    pipeline: [{
                        $project: {
                            _id: 0,
                            firstName: 1,
                            lastName: 1,
                            profileUrl: 1
                        }
                    }],
                    as: "comments.commentBy"
                }
            },
            {
                $project: {
                    _id: 0,
                    commentBy: "$comments.commentBy",
                    comment: "$comments.comment",
                    commentDate: { $dateToString: { format: "%m-%d-%Y %H:%M:%S", date: "$createdAt", timezone: "America/New_York" } }
                }
            }

        ]).toArray();
        if (eventDetail.length > 0) {
            console.log(eventDetail);
            return eventDetail;
        } else {
            throw "Event Not Found";
        }
    },
    async addCommentToEvent(id, comment, userId) {
        id = await valid.id(id);
        comment = await valid.checkString(comment, 'comment');
        userId = await valid.id(userId);

        //find post
        const eventsCollection = await events();
        const event = await eventsCollection.findOne({ _id: ObjectId(id) });
        if (!event) {
            throw 'Post not found!!';
        }
        if (event.createdBy.toString() !== userId.toString()) {
            if (event.participants.length > 0) {
                let isFound = event.participants.find(element => element.toString() === userId.toString());
                if (!isFound) {
                    throw 'UnAuthorized user'
                }
            } else {
                throw 'UnAuthorized user'
            }
        }

        let commentToAdd = {
            _id: new ObjectId(),
            commentBy: ObjectId(userId),
            comment: comment,
            commentDate: new Date()
        }
        // console.log("Adding to update")
        const updateInfo = await eventsCollection.updateOne(
            { _id: ObjectId(id) },
            { $addToSet: { comments: commentToAdd } }
        );
        // console.log("Adding to update")
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';

        return { success: true };
    },
    async rsvpEvent(id, userId) {
        id = await valid.id(id);
        userId = await valid.id(userId);
        let isUser = await students.getStudentById(userId);
        if (!isUser) {
            throw "User Not Found!!!";
        }
        const eventsCollection = await events();
        const event = await eventsCollection.findOne({ _id: ObjectId(id) });
        if (!event) {
            throw 'Post not found!!';
        }
        if (event.participantLimit === event.participants.length) {
            return true;
        }
        const updateInfo = await eventsCollection.updateOne(
            { _id: ObjectId(id) },
            { $addToSet: { participants: ObjectId(userId) } }
        );

        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';

        return { success: true };

    }
};