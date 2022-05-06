const valid = require("../data/valid")
const dbConnection = require('../config/mongoConnection');
const axios = require("axios");
// const eventData = require("../data/events");
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
    let ved_post = undefined;
    let deep = undefined;
    let deep_post = undefined;
    let vyqti = undefined;
    let vyaqti_post = undefined;
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
        deep = await studentData.createStudent("Deep","Patel", "dpatel@stevens.edu","dpatel@123","5514258288","3.png");
    }catch(e){
        console.log(e);
    }

    try{
       vyaqti = await studentData.createStudent("Vyaqti","Vikas", "vsingh@stevens.edu","vsingh@123","5524232288","6.png");
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
        vyaqti_post = await informativeData.createPost("I am facing problem with my CANVAS account","I have submissions due today but my canvas won't allow me to upload. Can anyone help me with this?", vyaqti._id.toString());
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

    // try{
    //     let abc = await valid.validateEventDate("1800-12-31")
    //     // console.log()
    // }catch(e){
    //     console.log(e)
    // }

    // try{
    //     let event = await eventData.createEvents("abc","des", "09/12/2022","1","150 North Street","6","Jersey City","New Jersey","07307","123","dguyfgefhiewufh", "rpk@stevens.edu");
    // }catch(e){
    //     console.log(e);
    // }

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
