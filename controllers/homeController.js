const bigPromise = require('../middlewares/bigPromise');

exports.home = bigPromise(async(req , res) => {
    res.status(200).json({
        success : true,
        greetings : "Welcome to the home route"
    }
    );
});


exports.dummy = (req , res) => {
    res.status(200).json({
        success : true,
        greetings : "Welcome to the dummy route"
    }
    );
};

