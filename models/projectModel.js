const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    project_name: {
      type: String,
      required: true,
    },
    scope_description: {
      type: String,
    },
    account_manager_name: {
      type: String,
    },
    developers: [
      {
        name: { type: String, required: true },
        photo: { type: String },
        skills: { type: [String], required: true },
        desc: { type: String },
        contact_no: { type: String },
        email_id: { type: String, required: true },
        hourly_rate: { type: Number },
        joining_date: { type: Date },
        availability: {
          type: String,
          enum: ['Available', 'Unavailable'],
          default: 'Available',
        },
      },
    ],
    deadline: {
      type: Date,
    },
    working_hours: {
      type: String,
      default: 'Not specified',
    },
    technology: {
      type: [String],
    },
    project_status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'On Hold'],
      default: 'Pending',
    },
    project_start_date: {
      type: Date,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company', // Reference to the Company model
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'projects',
    timestamps: true,
  },
);

const Project = mongoose.model('Project', projectSchema);

module.exports = { Project };
