const moment = require('moment-timezone');
const Quiz = require('../models/Quiz');

exports.createQuiz = async (req, res) => {
  try {
    const { question, options, rightAnswer, startDate, endDate } = req.body;
    const start = moment.tz(startDate, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata");
    const end = moment.tz(endDate, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata");

    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD HH:mm:ss" });
    }

    if (end.isBefore(start)) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const quiz = new Quiz({
      question,
      options,
      rightAnswer,
      startDate: start.toDate(),
      endDate: end.toDate(),
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getActiveQuiz = async (req, res) => {
  try {
    const now = moment().tz("Asia/Kolkata");
    const quizzes = await Quiz.find({
      startDate: { $lte: now.toDate() },
      endDate: { $gt: now.toDate() },
    });
    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'No active quizzes found' });
    }
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuizResult = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    const now = moment().tz("Asia/Kolkata");
    const quizEndTime = moment(quiz.endDate).tz("Asia/Kolkata");
    const resultTime = moment(quizEndTime).add(5, 'minutes');

    if (now.isBefore(quizEndTime)) {
      return res.json({
        message: 'Quiz is still active',
        endTime: quizEndTime.format("YYYY-MM-DD HH:mm:ss"),
        resultTime: resultTime.format("YYYY-MM-DD HH:mm:ss")
      });
    }

    if (now.isBefore(resultTime)) {
      return res.json({
        message: 'Quiz is finished. Please wait some time to get the result',
        resultTime: resultTime.format("YYYY-MM-DD HH:mm:ss")
      });
    }

    res.json({
      question: quiz.question,
      correctAnswer: quiz.options[quiz.rightAnswer - 1],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};