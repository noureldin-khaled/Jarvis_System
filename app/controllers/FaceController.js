var Kairos = require('kairos-api');
var client = new Kairos(process.env.APP_ID, process.env.APP_KEY);

module.exports.Train = function(req, res) {
    req.checkBody('image', 'required').notEmpty();
    req.checkBody('subject_id', 'required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.status(400).json({
            status: 'failed',
            errors: errors
        });

        return;
    }
    console.log(process.env.GALLERY_NAME);
    client.enroll({
        image: req.body.image,
        subject_id: req.body.subject_id,
        gallery_name: process.env.GALLERY_NAME
    }).then(function(result) {
        if (result.body.Errors) {
            res.status(400).json({
                status:'failed',
                code: result.body.Errors[0].ErrCode
            });
        }
        else {
            res.status(200).json({
                status: 'succeeded'
            });
            // res.statusCode = 200;
            // res.key = req.user.aes_public_key;
            // res.response = {
            //     status: 'succeeded'
            // };
            // next();
        }
    }).catch(function(err) {
        res.status(500).json({
            status:'failed',
            message: 'Internal server error'
        });
    });
};
