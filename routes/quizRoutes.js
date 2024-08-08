const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.post('/quizzes', auth, quizController.createQuiz);
router.get('/quizzes/active', quizController.getActiveQuiz);
router.get('/quizzes/:id/result', quizController.getQuizResult);
router.get('/quizzes/all', auth, quizController.getAllQuizzes);

module.exports = router;