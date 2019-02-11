var express = require('express');
var router = express.Router();
var fs = require('fs');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', (req, res, next) => {
    const problemsList = fs.readFileSync('./data/problems.json', 'utf-8');
    const parsedProblems = JSON.parse(problemsList);
  
    let levelIds = parsedProblems.map(({ difficulty_level }) => difficulty_level);
    levelIds = [...new Set(levelIds)];

    res.render('index', { problems: parsedProblems, levelIds });
});

router.get('/search/q=:level', (req, res, next) => {
    const problemsList = fs.readFileSync('./data/problems.json', 'utf-8');
    const parsedProblems = JSON.parse(problemsList);
    const targetLevel = req.params.level;

    let targetLevelProblems = [];
    let levelIds = parsedProblems.map(({ difficulty_level }) => difficulty_level);
    levelIds = [...new Set(levelIds)];


    for (const data of parsedProblems) {
        if (data.difficulty_level === +targetLevel) {
            targetLevelProblems.push(data);
        }
    }

    if (targetLevelProblems.length) {
        res.render('index', { problems: targetLevelProblems, levelIds });
        return;
    }

   next();
});

router.get('/:id', (req, res, next) => {
    const problemId = req.params.id;
    const problemsList = fs.readFileSync('./data/problems.json', 'utf-8');
    const parsedProblems = JSON.parse(problemsList);

    for (const data of  parsedProblems) {
        if (data.id === +problemId) {
            res.render('problem', { ...data, executionResults: [] });
            return;
        }
    }

    next();
});

router.post('/:id', urlencodedParser, (req, res, next) => {
    const userAnswer = req.body.userAnswer;
    const problemId = req.params.id;
    const problemsList = fs.readFileSync('./data/problems.json', 'utf-8');
    const parsedProblems = JSON.parse(problemsList);

    let targetProblem;

    for (const data of  parsedProblems) {
        if (data.id === +problemId) {
            targetProblem = data;
        }
    }

    const { tests } = targetProblem;
    const solution = new Function(`return (${userAnswer})(...arguments)`);

    const executionResults = [];

    for (let i = 0; i < tests.length; i++) {
        const userAnswer = eval(tests[i].code);
        const expectedAnswer = tests[i].solution;

        if (userAnswer !== expectedAnswer) {
            executionResults.push({ result: 'failed', expectedAnswer, userAnswer });

        } else {
            executionResults.push({ result: 'passed', expectedAnswer, userAnswer });
        }
    }

    if (executionResults.every(({ result }) => result === 'passed')) {
        res.render('success', { ...targetProblem, executionResults });

    } else {
        res.render('problem', { ...targetProblem, executionResults });
    }
});

module.exports = router;
