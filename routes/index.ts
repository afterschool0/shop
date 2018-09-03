let express = require('express');
let router = express.Router();
let mailer = require('nodemailer');


let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let DocSchema = new Schema({
    email: String,
    name: String,
    address: String,
    tel: String,
    products: [String],
    introducer: String,
    message: String
});

const timestamp: any = require('./timestamp');

DocSchema.plugin(timestamp);

//DocSchema.index({"email": 1}, {unique: true});

var Doc = mongoose.model('Doc', DocSchema);

//mongoose.connect("mongodb://admin:Nipp0nbashi7@localhost/test", {});
mongoose.connect("mongodb://localhost/contact", {});

// index

var send_mail = (content, callback) => {

    var mailsetting: any = {
        "service": "gmail",
        "auth": {
            "user": "inbox.7thcode@gmail.com",
            "pass": "33550336"
        }
    };

    var smtp_user: any = mailer.createTransport(mailsetting); //SMTPの接続

    var result_mail: any = {
        from: "oda.mikio@gmail.com",
        to: content.thanks,
        bcc: "oda.mikio@gmail.com",
        subject: "Thanks!",
        html: ` 
                username  : ${content.username}
                street    : ${content.street}
                contacttel:  ${content.contacttel}
                introducer:  ${content.introducer}
                request   :  ${content.request}
        `
    };

    //var result_mail = {
    //    from: "saito@cocoro.jpn.com",
    //    to: body.email,
    //    bcc: "saito@cocoro.jpn.com",
    //    subject: "Thanks!",
    //    html: "Message"
    //};

    smtp_user.sendMail(result_mail, (error) => {
        callback(error);
        smtp_user.close();
    });

};

router.post('/api/contact', function (request, response, next) {

    let content = request.body.content;

    let products: string[] = [];

    if (content.products1) {
        products.push("cocoro");
    }

    if (content.products2) {
        products.push("cocoro2");
    }

    //conformity
    let postdata = new Doc({
        email: content.thanks,
        name: content.username,
        address: content.street,
        tel: content.contacttel,
        products: content.products,
        introducer: content.introducer,
        message: content.request
    });

    postdata.save().then((saved_doc) => {
        send_mail(content, (error) => {
            if (!error) {
                response.json({code: 0, value: content});
            } else {
                response.json({code: error.code, value: {}});
            }
        });
    }).catch(error => {
        response.json({code: error, value: {}});
    })

});


router.get('/api/contact/:email', function (request, response, next) {

    var email = decodeURIComponent(request.params.email);

    Doc.findOne({email: email}).then(function (doc) {
        response.json(doc);
    });

});

router.get('/api/query', function (request, response, next) {

    Doc.find({}).then(function (docs) {
        response.json(docs);
    });

});

router.put('/api/contact/:email', function (request, response, next) {

    var email = decodeURIComponent(request.params.email);
    var value = request.params.value;

    Doc.findOneAndUpdate({email: email}, {$set: {value: value}}).then(function (updated_doc) {
        response.json(updated_doc);
    })

});

router.delete('/api/contact/:email', function (request, response, next) {

    var email = decodeURIComponent(request.params.email);

    Doc.findOneAndRemove({email: email}).then(function () {
        response.json({});
    })

});

module.exports = router;

/*
var send_mail = function (to, callback) {

    var mailer = require('nodemailer');

    var mailsetting = {
        "service": "gmail",
        "auth": {
            "user": "inbox.7thcode@gmail.com",
            "pass": "33550336"
        }
    };

    var smtp_user = mailer.createTransport(mailsetting); //SMTPの接続

    var result_mail = {
        from: "oda.mikio@gmail.com",
        to: to,
        bcc: "oda.mikio@gmail.com",
        subject: "subject",
        html: "Message"
    };

    smtp_user.sendMail(result_mail, function (error) {
        callback(error);
        smtpUser.close();
    });

};
*/