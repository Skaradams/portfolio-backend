require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors')

const express = require("express"),
  path = require('path'),
  nodeMailer = require('nodemailer'),
  bodyParser = require('body-parser');

const app = express();

app.use(express.static('src'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

// app.use((req, res) => {
//   // const origin = process.env.NODE_ENV === 'production' ?
//   //   'https://dc-portfolio-backend.herokuapp.com' :
//   //   'http://localhost:3000'
//   // res.setHeader('Access-Control-Allow-Origin', origin);
//   // res.setHeader('Access-Control-Allow-Methods', 'POST');
// })

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
    from: config.auth.user,
    to: RECIPIENT_EMAIL,
    subject: `[PORTFOLIO] ${ req.body.subject }`,
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
