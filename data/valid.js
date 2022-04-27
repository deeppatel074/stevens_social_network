const axios = require("axios");

function alphanumeric(inputtxt) {
    var letterNumber = /^[0-9a-zA-Z]+$/;
    if (inputtxt.match(letterNumber)) {
        return true;
    }
    else {
        return false;
    }
}
module.exports = {
    async checkString(str, name) {

        if (!str) {

            throw `${name} doesn't exists`;
        }
        if (typeof str != 'string') {

            throw `${name} is not a string`;
        }
        str = str.trim();
        if (str.length === 0) {

            throw `${name} is empty`;
        }
        return (str)
    },

    async validateEmail(email) {
        email = await this.checkString(email, "email");
        if (email.includes("@") == false) {
            throw `Not a valid Email ID`;
        }
        emailDomain = email.split("@");
        domainName = emailDomain[0];
        if (!alphanumeric(domainName)) {
            throw `Email Domain Name cannot contain Special Characters`
        }
        extensionstr = emailDomain[1];
        if (extensionstr !== "stevens.edu") {
            throw `Not a valid Stevens Email id`;
        }
        return (email.toLowerCase())
    },

    async validatePassword(password) {
        if (!password) {
            throw `Password NOT provided.`
        }
        if (password.indexOf(' ') >= 0) {
            throw `Password CANNOT contain empty spaces.`

        }
        password = password.trim();
        if (password.length == 0) {
            throw `Password is EMPTY`

        }

        if (password.length < 6) {
            throw `Password should be ATLEAST 6 characters long.`
        }
    },

    async validatePhoneNumber(phoneNumber) {
        var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        if (!re.test(phoneNumber)) {
            throw `Phone Number is not valid`;
        }
    },

    async validateConfirmPassword(password, confirmPassword) {
        if (password !== confirmPassword) {
            throw `Password and confirm password dose not match`;
        }
    },
    async validateLimit(participantLimit){
        if(!participantLimit)
        {
            throw `Enter Participant Limit`;
        }
        if(isNaN(participantLimit)){
            throw `Participant Limit should be a number`;
        }
        participantLimit = Number(participantLimit);
        if(participantLimit < 2){
            throw `Limit can't be less than 2`;
        }
        return(participantLimit)
    },

    async validateEventDate(eventDate){

        eventDate = await this.checkString(eventDate, "eventDate");
        eventDate = await this.dateFormat(eventDate, "yyyy-mm-dd");
        eventDate = new Date(eventDate);
        let today = new Date();
        if (eventDate < today){
            throw `Event can't be held before the current date `
        }
        eventDate = eventDate.toDateString().split("-");
        if(eventDate[1]<1 || eventDate[1]>12){
            throw "Month in eventDate is invalid";
        }

        let month31 = ["1","3","5","7","8","10","12"];
        let month30 = ["4","6","9","11"]
        let month31with0 = ["01","03","05","07","08","10","12"];
        let month30with0 = ["04","06","09","11"]

        if (month31.indexOf(eventDate[1]) != -1 || month31with0.indexOf(eventDate[1]) != -1){
            if(eventDate[2] < 1 || eventDate[2] > 31){
                throw `There are 31 days in this month`;      }
            }
        else if (month30.indexOf(eventDate[1]) != -1 || month30with0.indexOf(eventDate[1]) != -1){
            if(eventDate[2] < 1 || eventDate[2] > 31){
                throw `There are 30 days in this month`;      }
            }
        else {
            if(eventDate[2] < 1 || eventDate[2] > 28 ){
                throw `There are 28 days in this month`;
            }
        }

        if(eventDate[0]< 1900 ||eventDate[0] > 2023 ){
            throw "Valid range for eventDate is 1900-2023"
        }

        if(Date.parse(eventDate) === NaN){
            throw `event date is not a date.`
        }
    },
        //a simple date formatting function
        async  dateFormat(inputDate, format) {
        //parse the input date
        const date = new Date(inputDate);

        //extract the parts of the date
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();    

        //replace the month
        format = format.replace("mm", month.toString().padStart(2,"0"));        

         //replace the year
        if (format.indexOf("yyyy") > -1) {
            format = format.replace("yyyy", year.toString());
        } else if (format.indexOf("yy") > -1) {
            format = format.replace("yy", year.toString().substr(2,2));
        }

        //replace the day
        format = format.replace("dd", day.toString().padStart(2,"0"));

    return format;
},

async validateEventEntryPrice(price){
    if(!price)
    {
        throw `Enter Price`;
    }
    if(isNaN(price)){
        throw `Price should be a number`;
    }
    price = Number(price);
    if(price < 0){
        throw `Price can't be a number less than 0`
    }
    return(price);
},

async validateUSZip(zip) {
    let result =  /^\d{5}(-\d{4})?$/.test(zip);
    if(result == false){
        throw `Zip Code is not valid`;

    }
}

}


