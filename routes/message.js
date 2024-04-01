const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

const User = require('../models/user');
const Messages = require('../models/messages');







module.exports = router;