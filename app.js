require('dotenv').config();

let express = require("express"),
  path = require('path'),
  nodeMailer = require('nodemailer'),
  bodyParser = require('body-parser');

let app = express();

app.use(express.static('src'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.post('/send_email', function (req, res) {
  const { SENDER_EMAIL, SENDER_PASSWORD, RECIPIENT_EMAIL, SENDGRID_USERNAME, SENDGRID_PASSWORD } = process.env;
  const config = process.env.NODE_ENV === 'production' ?
    {
      service: 'Sendgrid',
      auth: {
        user: SENDGRID_USERNAME,
        pass: SENDGRID_PASSWORD
      }
    } :
    {
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
      }
    }

  let transporter = nodeMailer.createTransport(config);
  let mailOptions = {
    // should be replaced with real recipient's account
    to: RECIPIENT_EMAIL,
    subject: req.body.subject,
    text: req.body.message
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
  res.writeHead(301, { Location: 'index.html' });
  res.end();
});

let server = app.listen(process.env.PORT || 4000, function(){
  let port = server.address().port;
  console.log("Server started at http://localhost:%s", port);
});
