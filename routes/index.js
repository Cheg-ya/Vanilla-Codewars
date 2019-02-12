const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Problem = require('../models/Problem');

/* GET home page. */
router.get('/', (req, res, next) => {
  Problem.find().lean().exec((err, problems) => {
    res.render('index', { problems });
    return;
  });
});

module.exports = router;
