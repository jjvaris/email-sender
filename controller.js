const { check, validationResult } = require('express-validator');
const { apiKey, mailFrom, mailTo, mailSubject } = require('./config');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(apiKey);

const sendEmail = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, from, phoneNumber, message } = req.body;

  const msg = {
    to: mailTo,
    from: `${name} <${mailFrom}>`,
    subject: `${mailSubject} (${from})`,
    text: `${message}\n\n${name}\n${from}\n${phoneNumber ? phoneNumber : ''}`,
    replyTo: from,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent succesfully!');
      res.sendStatus(204);
    })
    .catch((error) => {
      console.error(error);
      console.log('Failed to send email.', error);
      console.log(msg);
      res.sendStatus(500);
    });
};

const validate = [
  [
    check('from').isEmail(),
    check('name').not().isEmpty(),
    check('message').not().isEmpty(),
  ],
];

module.exports = { sendEmail, validate };
