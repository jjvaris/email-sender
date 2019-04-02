require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const rateLimit = require('express-rate-limit');

const apiKey = process.env.API_KEY || 'mailgun-apiKey';
const domain = process.env.API_DOMAIN || 'mailgun-domain';
const mailTo = process.env.MAIL_TO || 'User Name <user.name@email.com>';
const mailSubject = process.env.MAIL_SUBJECT || 'Mail subject';
const mailgun = require('mailgun-js')({ apiKey: apiKey, domain: domain });

const app = express();

app.enable('trust proxy');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 100 requests per windowMs
});

app.use(cors());
app.use(logger('dev'));
app.use(limiter);
app.use(express.json());
app.use(router);

router.post(
  '/api/email',
  [
    check('from').isEmail(),
    check('name')
      .not()
      .isEmpty(),
    check('message')
      .not()
      .isEmpty()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, from, phoneNumber, message } = req.body;

    const data = {
      from: `${name} <postmaster@${domain}>`,
      to: mailTo,
      subject: `${mailSubject} (${from})`,
      text: `${message}\n\n${name}\n${from}\n${phoneNumber ? phoneNumber : ''}`,
      'h:Reply-To': from
    };

    mailgun.messages().send(data, (error, body) => {
      if (error) {
        console.log('Failed to send email.', error);
        console.log(data);
        res.sendStatus(500);
      } else {
        res.sendStatus(204);
      }
    });
  }
);

module.exports = app;
