const cron = require('node-cron');
const Quiz = require('../models/Quiz');

const updateQuizStatus = async () => {
  const now = new Date();
  await Quiz.updateMany(
    { startDate: { $lte: now }, endDate: { $gt: now }, status: { $ne: 'active' } },
    { $set: { status: 'active' } }
  );
  await Quiz.updateMany(
    { endDate: { $lte: now }, status: { $ne: 'finished' } },
    { $set: { status: 'finished' } }
  );
};

const startCronJob = () => {
  cron.schedule('* * * * *', async () => {
    console.log('Running quiz status update');
    await updateQuizStatus();
  });
};

module.exports = { startCronJob };