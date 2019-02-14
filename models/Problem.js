const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProbemSchema = new Schema({
  problems: {
    _id: Object,
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
  }
});

module.exports = Problem = mongoose.model('problems', ProbemSchema);
