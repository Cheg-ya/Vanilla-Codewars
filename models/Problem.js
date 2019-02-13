const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProbemSchema = new Schema({
    id: Object,
    problems: {
      id: Number,
      title: String,
      solution_count: Number,
      difficulty_level: Number,
      description: String,
      tests: [
        {
          code: String,
          solution: Number
        }
      ]
    },
    user: String
  });

module.exports = Problem = mongoose.model('problems', ProbemSchema);
