require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const emailController = require('./controller');

const app = express();

app.enable('trust proxy');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
  skipFailedRequests: true
});

app.use(cors());
app.use(logger('dev'));
app.use(limiter);
app.use(express.json());
app.use(router);

router.post('/api/email', emailController.validate, emailController.sendEmail);

module.exports = app;
