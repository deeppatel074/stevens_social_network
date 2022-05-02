const valid = require("../data/valid")
const axios = require("axios");
const eventData = require("../data/events");
async function main(){
    // try{
    //     let abc = await valid.validateEventDate("1800-12-31")
    //     // console.log()
    // }catch(e){
    //     console.log(e)
    // }

    try{
        let event = await eventData.createEvents("abc","des", "09/12/2022","1","150 North Street","6","Jersey City","New Jersey","07307","123","dguyfgefhiewufh", "rpk@stevens.edu");
    }catch(e){
        console.log(e);
    }

    try{
        let searchResult = await eventData.eventSearch("abc");
        console.log(searchResult);

    }catch(e){
        console.log(e);
    }
    try{
        let eventsAll = await eventData.getAllEvents();
        console.log(eventsAll);
    }catch(e){
        console.log(e);
    }
}

main();
