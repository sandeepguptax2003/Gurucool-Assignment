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
    set: function(v) {
      return moment.tz(v, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata").toDate();
    },
    get: function(v) {
      return moment(v).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    }
  },
  endDate: {
    type: Date,
    required: true,
    set: function(v) {
      return moment.tz(v, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata").toDate();
    },
    get: function(v) {
      return moment(v).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
    }
  },
  status: {
    type: String,
    enum: ['inactive', 'active', 'finished'],
    default: 'inactive',
  },
}, { 
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

function arrayLimit(val) {
  return val.length >= 2;
}

QuizSchema.pre('save', function(next) {
  if (now.isBefore(start)) {
    this.status = 'inactive';
  } else if (now.isSameOrAfter(start) && now.isBefore(end)) {
    this.status = 'active';
  } else {
    this.status = 'finished';
  }

  next();
});

module.exports = mongoose.model('Quiz', QuizSchema);