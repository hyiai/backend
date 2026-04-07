const { Contact } = require('../models/contactForm.js');
const {
  sendUserConfirmationEmail,
  sendAdminNotificationEmail,
} = require('../utils/EmailSender');
// Contact Form API - Handle form submission
const contactForm = async (req, res) => {
  try {
    // Destructure form data from the request body
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber) {
      return res
        .status(400)
        .json({ error: 'All fields are required except message.' });
    }

    // Save the contact form submission to the database
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
    });

    await newContact.save();

    // Send confirmation email to the user
    await sendUserConfirmationEmail(email, firstName);

    // Send form submission details to the admin
    await sendAdminNotificationEmail({
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
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

module.exports = { contactForm };
