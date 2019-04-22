const { check, validationResult } = require('express-validator/check');
const { apiKey, domain, mailFrom, mailTo, mailSubject } = require('./config');
const mailgun = require('mailgun-js')({ apiKey: apiKey, domain: domain });

const sendEmail = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, from, phoneNumber, message } = req.body;

  const data = {
    from: `${name} <${mailFrom}>`,
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
      console.log('Email send succesfully!');
      res.sendStatus(204);
    }
  });
};

const validate = [
  [
    check('from').isEmail(),
    check('name')
      .not()
      .isEmpty(),
    check('message')
      .not()
      .isEmpty()
  ]
];

module.exports = { sendEmail, validate };
