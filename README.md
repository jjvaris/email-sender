# Email Sender REST API

Simple REST API node server for sending emails. Designed to be used in website contact forms. Build top of mailgun API.

## Install

```sh
npm install
npm start
# or with nodemon
npm run dev
```

## API

`POST /api/email`

### request body

```
{
  "from": "jack.tester@email.com", // mandatory
  "name": "Jack Tester", // mandatory
  "phoneNumber": "+358502349842", //optional
  "message": "Email message body" // mandatory
}
```

### responses

`204` (no body for success)

`422` (validation error)

`429` (rate limit exceeded)

`500` (internal server error)
