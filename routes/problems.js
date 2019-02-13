const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Problem = require('../models/Problem');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res, next) => {
  Problem.find().lean().exec((err, problems) => {
    res.render('index', { problems });
    return;
  });
});

router.get('/search/q=:level', (req, res, next) => {
  Problem.find({ difficulty_level: +req.params.level }).lean().exec((err, problems) => {
    res.render('index', { problems });
    return;
  });
});

router.get('/:id', (req, res, next) => {
  Problem.findById(req.params.id).lean().exec((err, problem) => {
    if (err) {
      const error = new Error('Page Not Found');
      error.status = 404;

      next(error);
    }

    res.render('problem', { ...problem, executionResults: [], code: '' });
    return;
  });
});

router.post('/:id', urlencodedParser, (req, res, next) => {
  Problem.findById(req.params.id).lean().exec((err, problem) => {
    if (err) {
      const error = new Error('Unexpected Error');
      next(error);
    }

    res.send(problem);
  });
});

module.exports = router;
