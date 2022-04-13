const axios = require("axios");

function alphanumeric(inputtxt)
{
    var letterNumber = /^[0-9a-zA-Z]+$/;
    if(inputtxt.match(letterNumber)) 
    {
        return true;
    }
    else
    { 
        return false; 
    }
}
module.exports = {
    async checkString(str,name){

        if (!str){
            
            throw `${name} doesn't exists`;
        }
        if (typeof str != 'string'){
            
            throw `${name} is not a string`;
        }
        str = str.trim();
        if (str.length === 0){
           
            throw `${name} is empty`;
        }
        return(str)
    },
    
    async validateEmail(email){
        email = await this.checkString(email,"email");
        if(email.includes("@") == false){
            throw `Not a valid Email ID`;
        }
        emailDomain = email.split("@");
        domainName = emailDomain[0];
        if(!alphanumeric(domainName)){
            throw `Email Domain Name cannot contain Special Characters`
        }
        extensionstr = emailDomain[1];
        if(extensionstr !== "stevens.edu"){
            throw `Not a valid Stevens Email id`;
        }
        return(email.toLowerCase())
    },

    async validatePassword(password){
        if(!password){
            throw `Password NOT provided.`
        }
        if(password.indexOf(' ') >= 0){
            throw `Password CANNOT contain empty spaces.`
    
        }
        password = password.trim(); 
        if(password.length == 0){
            throw `Password is EMPTY`
    
        }
    
        if(password.length<6){
            throw `Password should be ATLEAST 6 characters long.`
        }
    },

    async validatePhoneNumber(phoneNumber){
        var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        if(!re.test(phoneNumber)){
            throw `Phone Number is not valid`;
        }
    },

    async validateConfirmPassword(password,confirmPassword){
        if(password!== confirmPassword){
            throw `passwords DONOT match`;
        }
    }
}