const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema(
  {
    companyName: {
      type: String,
    },
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

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserBase', // Reference UserBase
      required: true,
      unique: true,
    },

    companyLogo: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    summary: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: Number,
      default: null,
    },
    businessType: {
      type: String,
      default: null,
    },
    industryType: {
      type: String,
      default: null,
    },
    taxNumber: {
      type: Number,
      default: null,
    },

    timeZonePreferences: {
      type: String,
      defualt: null,
    },
  },
  {
    collection: 'companies',
    timestamps: true,
  },
);

// Disable required validations for inherited fields
companySchema.add({
  email: { type: String, required: false },
  password: { type: String, required: false },
});
// Create Jobseeker model using the schema
const Company = mongoose.model('companySchema', companySchema);

module.exports = { Company }; // Ensure UserBase is exported correctly
