const { ObjectId } = require('mongodb');
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
    async id(id) {
        if (!id) throw `You must provide an Id.`
        if (typeof id !== 'string') throw `$Id should be a string.`;
        id = id.trim();
        if (id.trim().length <= 0) throw `$Id string should not be empty.`;
        if (!ObjectId.isValid(id.trim())) throw `Enter valid object.`;
        return id;
    },
    async checkSessionId(id) {
        if (!id) throw `Invalid Session Data`
        if (typeof id !== 'string') throw `Invalid Session Data`;
        id = id.trim();
        if (id.trim().length <= 0) throw `Invalid Session Data`;
        if (!ObjectId.isValid(id.trim())) throw `Invalid Session Data`;
        return id;
    },
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
        // if (!alphanumeric(domainName)) {
        //     throw `Email Domain Name cannot contain Special Characters`
        // }
        extensionstr = emailDomain[1].toLowerCase();
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
        if (!phoneNumber) throw "Phone number should not be empty";
        if (phoneNumber.trim().length == 0) throw "Phone number should not be empty";
        var re = /[0-9]{3}-[0-9]{3}-[0-9]{4}/gm;
        if (!re.test(phoneNumber)) {
            throw `Phone Number is not valid`;
        }
    },

    async validateConfirmPassword(password, confirmPassword) {
        if (password !== confirmPassword) {
            throw `Password and confirm password dose not match`;
        }
    },
    async validateLimit(participantLimit) {
        if (!participantLimit) {
            throw `Enter Participant Limit`;
        }
        if (isNaN(participantLimit)) {
            throw `Participant Limit should be a number`;
        }
        participantLimit = Number(participantLimit);
        if (participantLimit < 2) {
            throw `Limit can't be less than 2`;
        }
        return (participantLimit)
    },

    async validateEventDate(eventDate) {

        eventDate = new Date(eventDate).toISOString();
        let today = new Date().toISOString();
        if (eventDate < today) {
            throw `Event can't be held before the current date `
        }
        return eventDate;
    }
}