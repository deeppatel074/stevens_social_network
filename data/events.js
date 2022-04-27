const axios = require ("axios");
const mongoCollections = require('../config/mongoCollections.js');
const students = mongoCollections.students;
const events = mongoCollections.events;
const { ObjectId } = require('mongodb');
const valid = require("./valid");


module.exports = {
    async createEvents (title,description,eventDate,eventEntryPrice, street,apartmentNumber,city,state,zip, participantLimit,bannerUrl,createdByEmail){
        title = await valid.checkString(title,"title");
        description = await valid.checkString(description,"description");
        await valid.validateEventDate(eventDate);
        eventDate = await valid.dateFormat(eventDate, "mm-dd-yyyy" );
        participantLimit = await valid.validateLimit(participantLimit);
        eventEntryPrice = await valid.validateEventEntryPrice(eventEntryPrice);
        bannerUrl = await valid.checkString(bannerUrl,"bannerUrl");
        street = await valid.checkString(street,"street");
        // apartmentNumber = await valid.checkString(apartmentNumber, "Apartment Number");
        city = await valid.checkString(city,"city");
        state = await valid.checkString(state,"state");
        await valid.validateUSZip(zip);
        let eventLocation ="";
        if(apartmentNumber != ""){
            eventLocation = street + "," + apartmentNumber + "," + city +","+ state +","+ zip;
        }else{
            eventLocation = street +  "," + city +","+ state +","+ zip;
        }
        
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
            eventEntryPrice : eventEntryPrice,
            eventLocation: eventLocation,
            street: street,
            apartmentNumber :  apartmentNumber,
            city : city,
            state : state,
            zip : zip,
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