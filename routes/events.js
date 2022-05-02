const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const xss = require('xss');
const valid = require("../data/valid");
const eventData = require("../data/events");


router 
.route("/")
.get(async (req, res) => {
    try{
        if (req.session.user) {
            let eventsAll = await eventData.getAllEvents();
            return res.status(200).render("events/eventsList", {
                eventsAll : eventsAll,
                title: "Events",
                logged: true
            });
        } else {
            return res.redirect('/');
        }
    }catch(e){
        res.status(500).json(e.message);
    }
})

.post(async(req,res) =>{
    let searchData = req.body;
    try{
        searchData.searchTerm = await valid.checkString(searchData.searchTerm,"Search Term"); 

    }catch(e){
        res.status(400).json({Error : e});
        return;
    }
    try{
        if(req.session.user){
            let searchResult = await eventData.eventSearch(searchData.searchTerm);
            // console.log(searchResult);
            res.render("events/eventsList", {
            title : "Events",
            searchResult: searchResult,
            logged: true,
            searchTerm : searchData.searchTerm
        });
        return;
        }
    }catch(e){
        res.status(404).json(e.message);

        return;
    }
});

router
.route("/register")
.get(async (req,res) => {
    try{
        if(!req.session.user){
            res.status(200).redirect("/");
            return;
        }else{
            res.status(200).render("events/registration",{
                title : "Events",
                
                logged: true
            });
            return;
        }
        
    }catch(e){
        res.status(500).json({error : e});
        return;
    }
})

.post(upload.single("bannerUrl"), async (req,res) =>{
    const eventsPostData = req.body;
    let bannerPic = req.file.path;
    try{
        eventsPostData.title = await valid.checkString(eventsPostData.title,"title");
        eventsPostData.description = await valid.checkString(eventsPostData.description,"description");
        await valid.validateEventDate(eventsPostData.eventDate);
        eventsPostData.participantLimit = await valid.validateLimit(eventsPostData.participantLimit);
        eventsPostData.eventEntryPrice=await valid.validateEventEntryPrice(eventsPostData.eventEntryPrice);
        eventsPostData.street = await valid.checkString(eventsPostData.street,"street");
        // eventsPostData.apartmentNumber = await valid.checkString(eventsPostData.apartmentNumber, "Apartment Number");
        eventsPostData.city = await valid.checkString(eventsPostData.city,"city");
        eventsPostData.state = await valid.checkString(eventsPostData.state,"state");
        await valid.validateUSZip(eventsPostData.zip);
        // eventsPostData.bannerUrl = await valid.checkString(eventsPostData.bannerUrl,"bannerUrl");
    }catch(e){
        res.status(400).render("events/registration",{
            title : "Errors",
            hasErrorsEventRegistration : true,
            errors : e,
            eventsPostData : eventsPostData,
            logged : true
        });
        return;
    }
    
    try{
        const {title,description,eventDate,eventEntryPrice,street,apartmentNumber,city,state,zip,participantLimit} =  eventsPostData
        let event = await eventData.createEvents(xss(title),xss(description),xss(eventDate),xss(eventEntryPrice), xss(street),xss(apartmentNumber),xss(city),xss(state),xss(zip), xss(participantLimit),xss(bannerPic),xss(req.session.user.email))
        // console.log(event);
        if(event.eventInserted == true){
          res.redirect('/events');
          return;
        }else{
            res.status(500).json({Error: "Internal Server Error"});
            return;
        }
    }catch(e){
        res.status(400).render("events/registration",{
            title : "Errors",
            hasErrorsEventRegister : true,
            errors : e,
            eventsPostData : eventsPostData,
            logged: true
        });
        return;
    }
})


module.exports = router;