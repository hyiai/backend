const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobseekerSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    fullName: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserBase',
      required: true,
      unique: true,
    },

    profilePicture: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: Number,
    },
    location: [
      {
        country: {
          type: String,
        },
        city: {
          type: String,
        },
        timezone: {
          type: String,
        },
      },
    ],
    summary: {
      type: String,
      default: null,
    },
    resume: {
      type: String,
      default: null,
    },
    technicalSkills: [
      {
        skill: {
          type: String,
          required: true,
        },
        exp: {
          type: Number,
          required: true,
        },
      },
    ],
    otherSkills: {
      type: Array,
      default: [],
    },
    experience: [
      {
        companyName: {
          type: String,
          required: true,
        },
        duration: {
          type: Date,
          required: true,
        },
        designation: {
          type: String,
          required: true,
        },
        industry: {
          type: [String],
          default: [],
        },
      },
    ],
    roles: [
      {
        role: {
          type: String,
        },
        specialities: {
          type: String,
        },
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        projectLink: {
          type: String,
          validate: {
            validator: function (v) {
              return /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
                v,
              );
            },
            message: (props) => `${props.value} is not a valid URL!`,
          },
        },
        technicalSkillUsed: { type: Array },
        Projectdescription: { type: String },
      },
    ],
    expectedPrice: [
      {
        price: {
          type: String,
        },
        currency: {
          type: String,
        },
      },
    ],
    education: [
      {
        university: {
          type: String,
          required: true,
        },
        fieldOfStudy: {
          type: String,
        },
        Specialization: { type: String },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        description: {
          type: String,
        },
      },
    ],
    certification: [
      {
        title: { type: String },
        issuedBy: { type: String },
        issuedDate: { type: Date },
        website: {
          type: String,
          validate: {
            validator: function (v) {
              return /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
                v,
              );
            },
            message: (props) => `${props.value} is not a valid URL!`,
          },
        },
        uploadCertificate: { type: String },
      },
    ],
    preference: [
      {
        typeOfJob: {
          type: String,
        },
        availableToWork: {
          type: String,
        },
        hourlyRate: {
          type: String,
        },
      },
    ],
    socialLinks: [
      {
        github: {
          type: String,
          validate: {
            validator: function (v) {
              return /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-_]+\/?$/.test(
                v,
              );
            },
            message: (props) => `${props.value} is not a valid GitHub URL!`,
          },
        },
        linkedin: {
          type: String,
          validate: {
            validator: function (v) {
              return /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_]+\/?$/.test(
                v,
              );
            },
            message: (props) => `${props.value} is not a valid LinkedIn URL!`,
          },
        },
      },
    ],
  },
  {
    collection: 'jobseekers', // Explicitly set the collection name
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  },
);
// Disable required validations for inherited fields
jobseekerSchema.add({
  email: { type: String, required: false },
  password: { type: String, required: false },
});
// Create Jobseeker model using the schema
const Jobseeker = mongoose.model('Jobseeker', jobseekerSchema);

module.exports = { Jobseeker }; // Ensure UserBase is exported correctly
