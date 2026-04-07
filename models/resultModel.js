// models/MockResult.js
const mongoose = require('mongoose');

const mockResultSchema = new mongoose.Schema({
  testId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  questions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      question: { type: String, required: true },
      options: [{ type: String, required: true }],
    },
  ],
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      selectedAnswer: { type: String },
    },
  ],
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const MockResult = mongoose.model('MockResult', mockResultSchema);

module.exports = MockResult;
