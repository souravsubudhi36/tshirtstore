const app = require('./app');
const connectionToDb = require('./config/db');
const cloudinary = require("cloudinary").v2;
require('dotenv').config();

// connected with database
connectionToDb();

//cloudinary configuration goes here
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_SECRET_KEY
    
}) 

app.listen(process.env.PORT , () => {
    console.log(`server is running at port: ${process.env.PORT}`);
})