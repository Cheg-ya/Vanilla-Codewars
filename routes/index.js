const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Problem = require('../models/Problem');

/* GET home page. */
router.get('/', (req, res, next) => {
  Problem.find().lean().exec((err, problems) => {
    if (err) {
      const error = new Error('Server might be under maintenance');
      error.status = 500;
      next(error);
    }

    res.render('index', { problems });
  });
});

module.exports = router;
