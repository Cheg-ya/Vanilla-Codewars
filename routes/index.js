var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', (req, res, next) => {
  const problemsList = fs.readFileSync('./data/problems.json', 'utf-8');
  const parsedProblems = JSON.parse(problemsList);

  let levelIds = parsedProblems.map(({ difficulty_level }) => difficulty_level);
  levelIds = [...new Set(levelIds)];

  res.render('index', { problems: parsedProblems, levelIds });
});

module.exports = router;
