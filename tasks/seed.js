const valid = require("../data/valid")
const axios = require("axios");

async function main(){
    try{
        let abc = await valid.validateEventDate("1800-12-31")
        // console.log()
    }catch(e){
        console.log(e)
    }
}

main();
