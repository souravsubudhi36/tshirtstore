// controller for signup methods

const bigPromise = require('../middlewares/bigPromise');
const User = require('../models/user');
const cookieToken = require('../utils/cookieToken');
const CustomError = require('../utils/customError');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');

exports.signup = bigPromise(async (req , res , next) => {
    
    const {name , email , password} = req.body;

    let result;
    if(req.file)
    {
        let file = req.files.photos
        result = await cloudinary.v2.uploader.upload(file , {
            folder : "users",
            width : 150,
            crop : "scale"
        })


        
    }

    // checking whether email , name , passwords are present or not

    if(!email || !name || !password)
    {
        return next(new CustomError("Name , email , password are required" , 400));
    }

    // storing it in database

    const user = await User.create(
        {
            name,
            email, 
            password,
            photo : {
                id : result.public_id,
                secure_url : result.secure_url
            }
        }
    );

    // getting the token from particular user
    cookieToken(user , res);

});