const mongoose = require('mongoose');
const moment = require('moment-timezone');

const QuizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} must have at least 2 options'],
  },
  rightAnswer: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v >= 1 && v <= this.options.length;
      },
      message: props => `${props.value} is not a valid index for the options array`
    }
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['inactive', 'active', 'finished'],
    default: 'inactive',
  },
}, { 
  timestamps: true,
});

function arrayLimit(val) {
  return val.length >= 2;
}

QuizSchema.pre('save', function(next) {
  const now = moment().tz("Asia/Kolkata");
  const start = moment(this.startDate).tz("Asia/Kolkata");
  const end = moment(this.endDate).tz("Asia/Kolkata");

  if (now.isBefore(start)) {
    this.status = 'inactive';
  } else if (now.isSameOrAfter(start) && now.isBefore(end)) {
    this.status = 'active';
  } else {
    this.status = 'finished';
  }

  next();
});

QuizSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.startDate = moment(obj.startDate).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
  obj.endDate = moment(obj.endDate).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
  return obj;
};

module.exports = mongoose.model('Quiz', QuizSchema);