const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const xss = require('xss');
const valid = require("../data/valid");
const eventData = require("../data/events");

router.get('/', async (req, res) => {
    if (req.session.user) {
        return res.status(200).render("events/eventsList", {
            title: "Events",
            logged: true
        });
    } else {
        return res.redirect('/');
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
            res.status(200).render("events/registration");
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
        await valid.validateLimit(eventsPostData.participantLimit);
        // eventsPostData.bannerUrl = await valid.checkString(eventsPostData.bannerUrl,"bannerUrl");
    }catch(e){
        res.status(400).render("events/registration",{
            title : "Errors",
            hasErrorsEventRegistration : true,
            errors : e,
            eventsPostData : eventsPostData
        });
        return;
    }
    
    try{
        const {title,description,eventDate,participantLimit} =  eventsPostData
        let event = await eventData.createEvents(xss(title),xss(description),xss(eventDate), xss(participantLimit),xss(bannerPic),xss(req.session.user.email))
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
            eventsPostData : eventsPostData
        });
        return;
    }
})


module.exports = router;