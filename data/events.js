const axios = require ("axios");
const mongoCollections = require('../config/mongoCollections.js');
const students = mongoCollections.students;
const events = mongoCollections.events;
const { ObjectId } = require('mongodb');
const valid = require("./valid");


module.exports = {
    async createEvents (title,description,eventDate, participantLimit,bannerUrl,createdByEmail){
        title = await valid.checkString(title,"title");
        description = await valid.checkString(description,"description");
        await valid.validateEventDate(eventDate);
        eventDate = await valid.dateFormat(eventDate, "mm-dd-yyyy" );
        await valid.validateLimit(participantLimit);
        bannerUrl = await valid.checkString(bannerUrl,"bannerUrl");
        
        let utc = new Date()
       
        const studentCollection = await students();
        const creator = await studentCollection.findOne({email: createdByEmail});
        if(!creator){
            throw `User not logged in`;
        }
        let newEvent = {
            title : title,
            description : description,
            eventDate : eventDate,
            participants: [ ],
            participantLimit : participantLimit,
            bannerUrl : bannerUrl,
            comments : [],
            createdBy: creator._id,
            createdAt: utc,
            status: 1
        }
        
        const eventCollection = await events();
        const insertInfo = await eventCollection.insertOne(newEvent);
        if (!insertInfo.acknowledged || !insertInfo.insertedId){
            throw `Event couldn't be created`;
        }
        else{
            return({eventInserted: true})
        } 

        



    }

} 