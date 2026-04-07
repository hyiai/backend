const { Career } = require('../models/careerModel');
const {
  sendUserConfirmationEmail,
  sendHrNotificationEmail,
} = require('../utils/EmailSender');
// Contact Form API - Handle form submission
const careerForm = async (req, res) => {
  try {
    // Destructure form data from the request body
    const { firstName, lastName, email, phoneNumber, message, resume } =
      req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !resume) {
      return res
        .status(400)
        .json({ error: 'All fields are required except message.' });
    }

    // Save the career contact form submission to the database
    const newCareer = new Career({
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
      resume,
    });

    await newCareer.save();

    // Send confirmation email to the user
    await sendUserConfirmationEmail(email, firstName);

    // Send form submission details to the admin
    await sendHrNotificationEmail({
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
      resume,
    });

    // Send a success response
    res.status(201).json({
      message: "Thank you for contacting us! We'll get back to you soon.",
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res
      .status(500)
      .json({ error: 'Something went wrong. Please try again later.' });
  }
};

module.exports = { careerForm };
