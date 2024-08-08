const cron = require('node-cron');
const moment = require('moment-timezone');
const Quiz = require('../models/Quiz');

exports.createQuiz = async (req, res) => {
  try {
    const { question, options, rightAnswer, startDate, endDate } = req.body;
    const start = moment.tz(startDate, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata");
    const end = moment.tz(endDate, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata");
    const now = moment().tz("Asia/Kolkata");

    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD HH:mm:ss" });
    }
    if (end.isSameOrBefore(start)) {
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
    const resultTime = moment(end).add(5, 'minutes');

    cron.schedule(resultTime.toDate(), async () => {
      quiz.status = 'finished';
      await quiz.save();
    });

    res.status(201).json({ ...quiz.toObject(), status: 'inactive' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getActiveQuiz = async (req, res) => {
  try {
    const now = moment().tz("Asia/Kolkata");
    const activeQuizzes = await Quiz.find({
      startDate: { $lte: now.toDate() },
      endDate: { $gt: now.toDate() },
      status: 'active'
    });

    if (activeQuizzes.length === 0) {
      return res.status(404).json({ message: 'No active quizzes found' });
    }

    res.json(activeQuizzes);
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

    if (now.isBefore(resultTime)) {
      return res.status(403).json({ message: 'Quiz result will be available after 5 minutes.' });
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