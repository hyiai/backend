const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const careerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    resume: {
      type: String,
      required: true,
    },
  },

  {
    collection: 'career',
    timestamps: true,
  },
);
const Career = mongoose.model('Career', careerSchema);
module.exports = { Career };
