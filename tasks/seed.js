const valid = require("../data/valid")
const dbConnection = require('../config/mongoConnection');
const axios = require("axios");
const eventData = require("../data/events");
const studentData = require("../data/students");
const informativeData = require("../data/informative");
const { ObjectId, UnorderedBulkOperation } = require("mongodb");
async function main(){
    const db = await dbConnection.connectToDb();
	await db.dropDatabase();
    let student = undefined;
    let jesica = undefined;
    let jesica_post = undefined;
    let ved = undefined;
    let pooja = undefined;
    let ved_post = undefined;
    let deep = undefined;
    let deep_post = undefined;
    let vyaqti = undefined;
    let vyaqti_post = undefined;
    let ved_createEvent = undefined;
    let deep_createEvent = undefined;
    let vyaqti_createEvent = undefined;
    let ved_replyToPost = undefined;
    let deep_replyToPost = undefined;
    let jesica_replyToPost = undefined;
    let vyaqti_replyToPost = undefined;
    let addParticipantsToVedEvent = undefined;
    let pooja_createEvent = undefined;
    let addParticipantsToPoojaEvent = undefined;
    let addParticipantsToVyaqtiEvent = undefined;
    try{
        jesica = await studentData.createStudent("Jesica","Bodas", "jbodas@stevens.edu","jbodas@123","5513258464","4.png");
    }catch(e){
        console.log(e);
    }

    try{
        ved = await studentData.createStudent("Ved","Bhanushali", "vbhanush@stevens.edu","vbhanush@123","5513258108","2.png");
    }catch(e){
        console.log(e);
    }

    try{
        pooja = await studentData.createStudent("Pooja","Hegde", "phegde@stevens.edu","phegde@123","5515329628","11.png");
    }catch(e){
        console.log(e);
    }


    try{
        deep = await studentData.createStudent("Deep","Patel", "dpatel18@stevens.edu","dpatel@123","5514258288","3.png");
    }catch(e){
        console.log(e);
    }

    try{
       vyaqti = await studentData.createStudent("Vyaqti","Vikas", "vsingh22@stevens.edu","vsingh@123","5524232288","6.png");
    }catch(e){
        console.log(e);
    }
    
    try{
        jesica_post = await informativeData.createPost("How can I contact the graduate office?","I want to update my address, can anyone help me with updating it?", jesica._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        ved_post = await informativeData.createPost("Oncampus jobs","If anyone knows how to get an oncampus job please let me know", ved._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        ved_replyToPost = await informativeData.addCommentsToPost(jesica_post._id.toString(), "You can contact me at +1 6314123123", ved._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        deep_post = await informativeData.createPost("How to become a TA?","I want to become a TA for CS 546, anyone knows whom to contact?", deep._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        pooja_post = await informativeData.createPost("How do I join the IGSA committiee of our college?","I want to join the IGSA club and connect with like-minded peers, if anyone has any idea about it then please buzz me up", pooja._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        vyaqti_post = await informativeData.createPost("I am facing problem with my CANVAS account","I have submissions due today but my canvas won't allow me to upload. Can anyone help me with this?", vyaqti._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        ved_replyToPost = await informativeData.addCommentsToPost(pooja_post._id.toString(), "You can mail them at igsa@stevens.edu and incase they have vacancy, they might fill you in", ved._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        pooja_replyToPost = await informativeData.addCommentsToPost(pooja_post._id.toString(), "Okay! thank you. I look forward to joining the committee and attenting events", pooja._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        vyaqti_replyToPost = await informativeData.addCommentsToPost(pooja_post._id.toString(), "You can also become the secretary of the committee if they find you enthusiast enough. They have voting every semester. You might wanna give it a shot", vyaqti._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        deep_replyToPost = await informativeData.addCommentsToPost(jesica_post._id.toString(), "You can mail to contact@isss.com and they will solve your queries", deep._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        ved_replyToPost = await informativeData.addCommentsToPost(vyaqti_post._id.toString(), "You can mail to canvashelp@stevens.edu and they will resolve it asap", ved._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        pooja_replyToPost = await informativeData.addCommentsToPost(vyaqti_post._id.toString(), "Thanks for solving! Even I had the same doubt", pooja._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        jesica_replyToPost = await informativeData.addCommentsToPost(deep_post._id.toString(), "You can directly contact the respective proffessors, for eg contact Prof Pattrick Hill inorder to become TA of CS 546.", jesica._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        jesica_replyToPost = await informativeData.addCommentsToPost(ved_post._id.toString(), "You can apply for oncampus jobs through workday", jesica._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        jesica_replyToPost = await informativeData.addCommentsToPost(ved_post._id.toString(), "You can apply for oncampus jobs through workday", jesica._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        ved_replyToPost = await informativeData.addCommentsToPost(ved_post._id.toString(), "Where access workday from? ", ved._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        vyaqti_replyToPost = await informativeData.addCommentsToPost(ved_post._id.toString(), "Go to mystevens.com and navigate to workday ", vyaqti._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        deep_replyToPost = await informativeData.addCommentsToPost(ved_post._id.toString(), "You can also directly walk in and try if they have vanacies, then you're lucky", deep._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        ved_createEvent = await eventData.createEvents("Houseparty", "This is a housewarming party at our place where we are hoping to see you guys in large numbers. We are new to Jersey City and hope to connect with our fellow stevens friends. Hope to see you all !", "05/20/2022 20:00","100 Bowers","Get free food","20","2.png",ved._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        pooja_createEvent = await eventData.createEvents("Netflix and Chill", "It's summer time and I've got a new projector setup so anyone up for a netflix and chill session. Come over and will have fun", "05/24/2022 22:00","172 Hutton St","Free Popcorn","5","5.png",pooja._id.toString());
    }catch(e){
        console.log(e);
    }

    // try{
    //     ved_createEvent = await eventData.createEvents("Houseparty", "This is a housewarming party at our place where we are hoping to see you guys in large numbers. We are new to Jersey City and hope to connect with our fellow stevens friends. Hope to see you all !", "05/20/2022 20:00","100 Bowers","Get free food","20","2.png",ved._id.toString());
    // }catch(e){
    //     console.log(e);
    // }

    try{
        deep_createEvent = await eventData.createEvents("Web Programming meet up", "I am planning to arrange a web programming event for upcoming web programming students. I would advise people who have taken CS 546 of Prof Hill to RSVP for this event as I'll share some technicalities of the event. Students from other majors are welcome as well", "06/18/2022 16:00","170 Hutton St","Gain knowledge and be one step ahead of other freshly registered students","30","3.png",deep._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        vyaqti_createEvent = await eventData.createEvents("Just a casual meetup", "Hey Guys! I'm creating this event as its going to be summer now and I'm bored. So anyone of y'all who wants to just hangout can join this event", "05/28/2022 21:00","140 North Bergen St","Make some new friends","20","4.png",vyaqti._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        addParticipantsToVyaqtiEvent = await eventData.rsvpEvent(vyaqti_createEvent._id, deep._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        addParticipantsToVyaqtiEvent = await eventData.rsvpEvent(vyaqti_createEvent._id, pooja._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        deep_addCommentToEvent = await eventData.addCommentToEvent(vyaqti_createEvent._id,"Even I'm bored. Let's go for movie?",deep._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        pooja_addCommentToEvent = await eventData.addCommentToEvent(vyaqti_createEvent._id,"Guys which movie are you planning to go for?",pooja._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        deep_addCommentToEvent = await eventData.addCommentToEvent(vyaqti_createEvent._id,"Let's go for Dr. Strange Multiverse of madness? I've heard it's an amazing movie ",deep._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        pooja_addCommentToEvent = await eventData.addCommentToEvent(vyaqti_createEvent._id,"Yeah even some of my friends were praising that movie and Benedict Cumberbatch is STARRR ",pooja._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        vyaqti_addCommentToEvent = await eventData.addCommentToEvent(vyaqti_createEvent._id,"Okay! Let's go for Dr. Strange then ",vyaqti._id.toString());
    }catch(e){
        console.log(e);
    }


    

    try{
        ved_addCommentToEvent = await eventData.addCommentToEvent(ved_createEvent._id,"Please just bring some chips for the party",ved._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        addParticipantsToVedEvent = await eventData.rsvpEvent(ved_createEvent._id, deep._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        addParticipantsToDeepEvent = await eventData.rsvpEvent(deep_createEvent._id, vyaqti._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        addParticipantsToDeepEvent = await eventData.rsvpEvent(deep_createEvent._id, ved._id.toString());
    }catch(e){
        console.log(e);
    }


    try{
        addParticipantsToVedEvent = await eventData.rsvpEvent(ved_createEvent._id, jesica._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        addParticipantsToPoojaEvent = await eventData.rsvpEvent(pooja_createEvent._id, jesica._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        addParticipantsToPoojaEvent = await eventData.rsvpEvent(pooja_createEvent._id, ved._id.toString());
    }catch(e){
        console.log(e);
    }
    
    try{
        jesica_addCommentToEvent = await eventData.addCommentToEvent(pooja_createEvent._id,"Which movie/show are we planning to watch? Because I can't watch the same movie twice :p",jesica._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        pooja_addCommentToEvent = await eventData.addCommentToEvent(pooja_createEvent._id,"Uhmm.. I was planning we could binge watch friends, but any suggesstion would be great! ",pooja._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        ved_addCommentToEvent = await eventData.addCommentToEvent(pooja_createEvent._id,"Yaayy!! I love that show, I can watch it maybe a million times ",ved._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        jesica_addCommentToEvent = await eventData.addCommentToEvent(pooja_createEvent._id,"Okay! that sounds cool",jesica._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        pooja_addCommentToEvent = await eventData.addCommentToEvent(pooja_createEvent._id,"Friends it is then guys! Hurray! ",pooja._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        deep_addCommentToEvent = await eventData.addCommentToEvent(ved_createEvent._id,"Okay! I'll get chips. Can someone else bring some soda?",deep._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        jesica_addCommentToEvent = await eventData.addCommentToEvent(ved_createEvent._id,"Sure, I'll get soda",jesica._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        vyaqti_addCommentToEvent = await eventData.addCommentToEvent(deep_createEvent._id,"Hey guys! if anyone from hoboken is going for the event then buzz me up, I'll join you guys",vyaqti._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        ved_addCommentToEvent = await eventData.addCommentToEvent(deep_createEvent._id,"This event sounds so cool!! I'm probably gonna reach an hour early ",ved._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        vyaqti_addCommentToEvent = await eventData.addCommentToEvent(deep_createEvent._id,"Hey Ved, are you from hoboken?",vyaqti._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        ved_addCommentToEvent = await eventData.addCommentToEvent(deep_createEvent._id,"Np, but I'll pick you up from your location. I've got a car. Give me your address and I'll pick you up.",ved._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        vyaqti_addCommentToEvent = await eventData.addCommentToEvent(deep_createEvent._id,"Thank You so much! That'll be great. You can pick me up from 100 Bowers",vyaqti._id.toString());
    }catch(e){
        console.log(e);
    }

    try{
        ved_addCommentToEvent = await eventData.addCommentToEvent(deep_createEvent._id,"Okay I'll beep a horn when I'm there",ved._id.toString());
    }catch(e){
        console.log(e);
    }




    // try{
    //     let searchResult = await eventData.eventSearch("abc");
    //     console.log(searchResult);

    // }catch(e){
    //     console.log(e);
    // }
    // try{
    //     let eventsAll = await eventData.getAllEvents();
    //     console.log(eventsAll);
    // }catch(e){
    //     console.log(e);
    // }
}

main();
