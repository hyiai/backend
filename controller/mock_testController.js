const { v4: uuidv4 } = require('uuid');
const Question = require('../models/quationModel');
const MockResult = require('../models/resultModel');

// Function to start the test
const startTest = async (req, res) => {
  const { userName, languages } = req.body;

  // Validate username
  if (!userName || userName.trim().length === 0) {
    return res.status(400).json({
      message: 'Username is required and cannot be empty',
    });
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
  if (!usernameRegex.test(userName)) {
    return res.status(400).json({
      message:
        'Username must be 3-15 characters long and can only contain letters, numbers, and underscores.',
    });
  }

  // Validate language selection (maximum 2 languages)
  if (!Array.isArray(languages) || languages.length > 2) {
    return res.status(400).json({
      message: 'You can select a maximum of 2 languages.',
    });
  }

  const validLanguages = ['JavaScript', 'Java', 'Python', 'SQL'];
  const invalidLanguages = languages.filter(
    (lang) => !validLanguages.includes(lang),
  );

  if (invalidLanguages.length > 0) {
    return res.status(400).json({
      message: `Invalid language selection: ${invalidLanguages.join(', ')}`,
    });
  }

  try {
    const testId = uuidv4();
    const questions = await Question.aggregate([
      { $match: { language: { $in: languages } } },
      { $sample: { size: 20 } },
    ]);

    return res.status(200).json({
      message: `Hello ${userName}, please answer the following 20 questions from ${languages.join(
        ' and ',
      )}:`,
      testId,
      questions,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'An error occurred while starting the test.',
      error: err.message,
    });
  }
};

// Function to submit answers and get results
const submitTest = async (req, res) => {
  const { answers, userName, testId, languages } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length !== 20) {
    return res.status(400).json({
      message: 'Please submit answers for all 20 questions.',
    });
  }

  // Validate language selection (same as in startTest)
  const validLanguages = ['JavaScript', 'Java', 'Python', 'SQL'];
  const invalidLanguages = languages.filter(
    (lang) => !validLanguages.includes(lang),
  );

  if (invalidLanguages.length > 0) {
    return res.status(400).json({
      message: `Invalid language selection: ${invalidLanguages.join(', ')}`,
    });
  }

  try {
    const questions = await Question.find({ language: { $in: languages } });

    let score = 0;
    let wrongAnswers = [];

    answers.forEach((answer) => {
      const question = questions.find(
        (q) => q._id.toString() === answer.questionId,
      );

      if (question) {
        const selectedOption = answer.selectedAnswer;
        const correctOption = question.correctAnswer;

        // Mapping option letters to their corresponding answer choices
        const optionLetters = ['a', 'b', 'c', 'd'];
        const selectedAnswer =
          question.options[optionLetters.indexOf(selectedOption)];

        if (selectedAnswer === correctOption) {
          score++;
        } else {
          wrongAnswers.push({
            questionId: question._id,
            question: question.question,
            selectedAnswer,
            correctAnswer: correctOption,
          });
        }
      }
    });

    const result = new MockResult({
      userName,
      testId,
      languages,
      answers,
      score,
    });

    await result.save();

    return res.status(200).json({
      message: 'Test submitted successfully',
      score: `${score} out of 20 correct answers`,
      wrongAnswers: wrongAnswers,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'An error occurred while submitting the test.',
      error: err.message,
    });
  }
};

module.exports = { startTest, submitTest };
