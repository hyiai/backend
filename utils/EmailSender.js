const nodemailer = require('nodemailer');

// Function to generate OTP
const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
};

// HTML template for OTP email
const generateOtpEmailTemplate = (otp) => {
  return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">

      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
      </head>

      <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
          <tbody>
            <tr>
              <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                  <tbody>
                    <tr>
                      <td style="padding: 40px 0px 0px;">
                        <div style="padding: 20px; background-color: rgb(255, 255, 255); border-radius: 15px;">
                          <div style="color: rgb(0, 0, 0); text-align: left;">
                            <h1 style="margin: 1rem 0;text-align:center">HYI.AI Registration</h1>
                            <p style="padding-bottom: 16px;text-align:center">You requested to Signup. Please use the OTP below to proceed:</p>
                            <p style="padding-bottom: 16px; font-size: 130%; color: purple;text-align:center">
                              <strong>${otp}</strong>
                            </p>
                            <p style="padding-bottom: 16px;text-align:center;font-size:12px">This OTP is valid for the next 10 minutes. Please enter it soon to avoid expiration.</p>

                          </div>
                        </div>
                        <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                          <p style="padding-bottom: 16px">Hireyoo info tech</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>

      </html>
    `;
};

// Send OTP email
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    tls: {
      rejectUnauthorized: false, // Only for testing/development
    },
    auth: {
      user: process.env.SMTP_GMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_GMAIL,
    to: email,
    subject: 'OTP for Signup',
    text: `Your OTP for Resgistration: ${otp}`, // Fallback plain text
    html: generateOtpEmailTemplate(otp), // Styled HTML email
  };

  await transporter.sendMail(mailOptions);
};

//Function to send welcome email to user
const sendWelcomeEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.SMTP_GMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_GMAIL,
    to: email,
    subject: 'Welcome to HireYoo Infotech!',
    html: `
       <div style="font-family: 'Arial', sans-serif; background-color: #ffffff; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; padding-bottom: 20px;">
   
  </div>
  <h2 style="color: #333333; font-size: 24px; margin-bottom: 10px; text-align: center;">Welcome to HireYoo Infotech!</h2>
  <p style="color: #555555; font-size: 16px; line-height: 1.5; text-align: center;">Hello, and thank you for joining the HireYoo Infotech family! We're excited to have you onboard and look forward to helping you achieve great things with us.</p>
  <p style="color: #555555; font-size: 16px; line-height: 1.5; text-align: center;">Our team is always here to support you, so feel free to reach out if you need assistance at any point.</p>
  <div style="text-align: center; margin-top: 30px;">
    <p style="color: #888888; font-size: 14px;">Best Regards,</p>
    <strong style="color: #333333; font-size: 16px;">The HireYoo Infotech Team</strong>
  </div>
  <div style="text-align: center; margin-top: 20px;">
    <p style="color: #888888; font-size: 14px;">Need help? <a href="mailto:tech@hireyoo.com" style="color: #007bff; text-decoration: none;">Contact Support</a></p>
  </div>
</div>

      `,
  };

  await transporter.sendMail(mailOptions);
};

// Email utility function to send reset link
const sendResetLinkEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    tls: {
      rejectUnauthorized: false, // Only for testing/development
    },
    auth: {
      user: process.env.SMTP_GMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_GMAIL,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested to reset your password. Click the link to reset your password: ${resetLink}`,
    html: `
      
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href="${resetLink}"
                                            style="background:#1e1e2d;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.hireyoo.com</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>


    `,
  };

  await transporter.sendMail(mailOptions);
};

// Function to send form sumbission confirmation email to the user
const sendUserConfirmationEmail = async (email, firstName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.SMTP_GMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_GMAIL,
    to: email,
    subject: 'Thank You for Contacting Us!',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
        <h2>Hello ${firstName},</h2>
        <p>Thank you for reaching out to us. We've received your message and will get back to you soon.</p>
        <p>If you have any urgent queries, feel free to reply to this email.</p>
        <br>
        <strong>Best regards,</strong><br>
        <strong>The Team at HireYoo</strong>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

//  Function to send form submission details to the admin
const sendAdminNotificationEmail = async (formData) => {
  const { firstName, lastName, email, phoneNumber, message } = formData;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.SMTP_GMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_GMAIL,
    to: 'tech@hireyoo.com',
    subject: 'New Contact Form Submission',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2>New Contact Form Submission</h2>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Message:</strong> ${message || 'No message provided.'}</p>
        <br>
        <strong>This is an automated notification from your website.</strong>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

//  Function to send form submission details to the Hr
const sendHrNotificationEmail = async (formData) => {
  const { firstName, lastName, email, phoneNumber, message, resume } = formData;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.SMTP_GMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_GMAIL,
    to: 'hr@hireyoo.com',
    subject: 'New Contact Form Submission',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2>New Contact Form Submission</h2>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Message:</strong> ${message || 'No message provided.'}</p>
        <p><strong>Message:</strong> ${resume || 'No message provided.'}</p>
        <br>
        <strong>This is an automated notification from your website.</strong>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Function to send form sumbission confirmation email to the user
const sendPasswordResetSuccessEmail = async (email, firstName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.SMTP_GMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_GMAIL,
    to: email,
    subject: 'Password Reset Successful',
    text: 'Your password has been successfully reset. If you did not request this change, please contact support immediately.',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f9f9f9;">
        <h2>Hello ${email},</h2>
        <p>Your password has been successfully reset.</p>
        <p>If you did not request this change, please contact support immediately.</p>
        <br>
        <strong>Best regards,</strong><br>
        <strong>The Team at HireYoo</strong>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
module.exports = {
  sendResetLinkEmail,
  sendWelcomeEmail,
  sendUserConfirmationEmail,
  sendAdminNotificationEmail,
  sendHrNotificationEmail,
  generateOtp,
  sendOtpEmail,
  sendPasswordResetSuccessEmail,
};
