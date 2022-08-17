const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required : [true , 'please provide a name'],
            maxlength : [40 , 'please provide your name in 40 characters']
        },
        email : {
            type: String,
            required : [true , 'please provide a name'],
            unique : true,
            validate: [validator.isEmail , 'please enter a valid email format'],
        },
        password : {
            type: String,
            required : [true , 'please provide a password'],
            minlength : [6 , "please set a password of atleast 6 charachters"],
            select : false
        },
        role : {
            type : String,
            default : 'user'
        },
        photo : {
            id : {
                type : String,
                required : true
            },
            secure_url : {
                type : String,
                required : true

            }
        },
        forgotPasswordToken : {
            type : String
        },
        forgotPasswordExpiry : {
            type : Date
        },
        createdAt : {
            type: Date,
            default : Date.now
        }
    }
)

//encrypt password before save using pre hooks

userSchema.pre('save' , async function(next){
    if(!this.isModified('password'))
    {
        return next();
    }
    this.password = await bcrypt.hash(this.password , 10);
});

//validating the password 

userSchema.methods.isValidatedPassword = async function(userSendPassword){

    return await bcrypt.compare(userSendPassword , this.password);
}

// creating jwt token 

userSchema.methods.getJwtToken = function(){
    return jwt.sign({
        id : this._id,
    } , process.env.JWT_SECRET , 
    {
        expiresIn : process.env.JWT_EXPIRY
    });

};

//generating forgot password token (string)

userSchema.methods.getForgotPasswordToken = function(){

    //getting the forgot token string to return
    const forgotToken = crypto.randomBytes(20).toString('hex');

    // getting a hash - make sure to get hash on the backend
    this.forgotPasswordToken = crypto.createHash("sha256").update(forgotToken).digest('hex');

    // time of token
    this.forgotPasswordExpiry = Date.now() + process.env.FORGOT_PASSWORD_EXPIRY;

    return forgotToken;
}

module.exports = mongoose.model("User" , userSchema);