const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const vm = require('vm');

const jsonParser = bodyParser.json();

router.get('/', (req, res, next) => {
  Problem.find().lean().exec((err, problems) => {
    if (err) return next(err);

    res.render('index', { problems });
  });
});

router.get('/search/q=:level', (req, res, next) => {
  Problem.find({ difficulty_level: +req.params.level }).lean().exec((err, problems) => {
    if (err) {
      const error = new Error('Server might be under maintenance');
      error.status = 400;

      return next(error);
    }

    if (!problems.length) {
      const error = new Error('Page Not Found');
      error.status = 404;

      return next(error);
    }

    res.render('index', { problems });
  });
});

router.get('/:id', (req, res, next) => {
  Problem.findById(req.params.id).lean().exec((err, problem) => {
    if (err) {
      const error = new Error('Page Not Found');
      error.status = 404;

      return next(error);
    }

    res.render('problem', problem);
  });
});

router.post('/:id', jsonParser, (req, res, next) => {
  Problem.findById(req.params.id).lean().exec((err, problem) => {
    if (err) {
      const error = new Error('Server might be under maintenance');
      error.status = 400;

      return next(error);
    }

    const userAnswer = req.body.solution;
    const { tests } = problem;
    const executionResults = [];

    for (let i = 0; i < tests.length; i++) {
      let userSolutionResult;

      try {
        userSolutionResult = vm.runInNewContext(
          `${userAnswer};
          ${tests[i].code};`,
          {
            setTimeout,
            setInterval
          });

      } catch (err) {
        userSolutionResult = err.message;
      }

      const expectedAnswer = tests[i].solution;

      if (userSolutionResult !== expectedAnswer) {
        executionResults.push({ result: 'failed', expectedAnswer, userAnswer: userSolutionResult });

      } else {
        executionResults.push({ result: 'passed', expectedAnswer, userAnswer: userSolutionResult });
      }
    }

    let testResult;

    if (executionResults.every(({ result }) => result === 'passed')) {
      testResult = { allPassed: true, executionResults };

    } else {
      testResult = { allPassed: false, executionResults };
    }

    res.send(testResult);
  });
});

module.exports = router;
