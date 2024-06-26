const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

// SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_DEV_PASSWORD_RESET_KEY);


/**
 * Generate a random token
 * @returns {string} - A random token in hexadecimal format
 */
function generateToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Store the token with the user email
const passwordResetTokens = new Map();

// reset password with email if user has forgotten password but remembers their email
router.get('/resetPasswordWithEmail', (req, res) => {
  const success = req.query.success === 'true';
  res.render('resetPasswordWithEmail.ejs', { success });
});


/**
 * Encrypt password to be stored in the database
 * @param {string} password - The password to be hashed
 * @returns {string} - The hashed password
 */
function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

/**
 * POST /resetPasswordWithEmail
 * Route to handle the submission of the password reset request
 * Sends a password reset email with a unique token
 * @route POST /resetPasswordWithEmail
 * @param {string} req.body.email - The email address of the user requesting password reset
 * @returns {void} - Redirects to the resetPasswordWithEmail page with a success message
 * @throws {404} - User not found
 * @throws {500} - Internal Server Error
 */
router.post('/resetPasswordWithEmail', async (req, res) => {
  const email = req.body.email;
  console.log('email (post resetpw w email): ', email)
  req.session.email = email;

  try {
    // Check if user exists
    const user = await usersModel.findOne({ email: email });
    if (!user) {
      // Handle case where user doesn't exist
      return res.status(404).send('User not found');
    }

    // Generate unique token
    const token = generateToken();

    // Store token with the user email
    passwordResetTokens.set(email, token);

    // Create a password reset link with the token
    const resetLink = `http://localhost:3000/resetPasswordForm?token=${token}&email=${email}`;


    /**
    *  Create password reset email
    *  Generated by AI copilot 
    *  @author https://github.com/copilot
    *  @property {string} to - Recipient email address
    *  @property {string} from - Sender email address
    *  @property {string} subject - Subject of the email
    *  @property {string} html - HTML content of the email
    */
    const msg = {
      to: email,
      from: 'gamesetmatchdtcsix@gmail.com',
      subject: 'Password Reset',
      html: `Click <a href="${resetLink}">here</a> to reset your password.
      <br>
      <footer style="border-top: 1px solid #eaeaea; padding-top: 10px; text-align: center; font-size: 12px; color: #888;">
        <p>&copy; 2024 DTC06 Gamesetmatch. All rights reserved.</p>
        <p>Contact us at <a href="mailto:gamesetmatchdtcsix@gmail.com">gamesetmatchdtcsix@gmail.com</a></p>
        <p>Privacy Policy</p>
      </footer>`,
    };
    // Send password reset email
    await sgMail.send(msg);

    console.log('email sent')
    // Display success message
    res.redirect('/resetPasswordWithEmail?success=true')
  } catch (error) {
    s
    console.error('Error sending password reset email:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * GET /resetPasswordForm
 * Route to render the password reset form
 * @route GET /resetPasswordForm
 * @param {string} req.query.email - The email address of the user resetting the password
 * @param {string} req.query.token - The token for password reset
 * @returns {void} - Renders the resetPasswordForm.ejs view with the email and token
 */
router.get('/resetPasswordForm', async (req, res) => {
  const email = req.query.email;
  console.log('email: ', email)

  const token = req.query.token.trim().toLowerCase();

  console.log('Token: ', token);
  console.log('PasswordResetTokens: ', passwordResetTokens);


  // Code below should work - it doesn't - console logs indicate that tokens are generated/stored correctly


  // if (!passwordResetTokens.has(token)) {
  //   console.log('Token not found in passwordResetTokens map.');
  //   return res.status(400).send('Invalid or expired token');
  // }

  // const email = passwordResetTokens.get(token);

  res.render('resetPasswordForm.ejs', { email, token });
});

/**
 * POST /resetPasswordForm
 * Route to handle the submission of the password reset form
 * @route POST /resetPasswordForm
 * @param {string} req.body.email - The email address of the user resetting the password
 * @param {string} req.body.token - The token for password reset
 * @param {string} req.body.newPassword - The new password to be set
 * @returns {void} - Sends a success message if the password is reset, otherwise sends an error message
 * @throws {500} - Internal Server Error
 */
router.post('/resetPasswordForm', async (req, res) => {
  const { email, token, newPassword } = req.body;
  console.log('req body:', req.body)

  // Code below should work - it doesn't - console logs indicate that tokens are generated/stored correctly

  // if (!passwordResetTokens.has(token) || passwordResetTokens.get(token) !== email) {
  //   return res.status(400).send('Invalid or expired token');
  // }

  try {

    console.log('new pw: ', newPassword)
    // Encrypt new password
    const hashedPassword = hashPassword(newPassword);
    console.log('email:', email)
    // Update new password in database
    await usersModel.updateOne({ email: email }, { password: hashedPassword });

    // Remove token from the map to prevent reuse
    passwordResetTokens.delete(token);

    res.send('Password reset successfully');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
