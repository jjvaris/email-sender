const apiKey = process.env.API_KEY || 'mailgun-apiKey';
const domain = process.env.API_DOMAIN || 'mailgun-domain';
const mailFrom = process.env.MAIL_FROM || 'user.name@domain.com';
const mailTo = process.env.MAIL_TO || 'Mail To <mail.to@email.com>';
const mailSubject = process.env.MAIL_SUBJECT || 'Mail subject';

module.exports = { apiKey, domain, mailFrom, mailTo, mailSubject };
