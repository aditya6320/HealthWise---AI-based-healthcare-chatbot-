const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure nodemailer with your email service credentials
// For production, use environment variables for sensitive information
// Prefer Firebase Functions config; fallback to env for local testing
const emailUser = (functions.config().email && functions.config().email.user) || process.env.EMAIL_USER;
const emailPass = (functions.config().email && functions.config().email.password) || process.env.EMAIL_PASSWORD;

const transporter = emailUser && emailPass
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    })
  : null;

// Cloud Function triggered when a new user is created
exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const { email, displayName, uid } = user;
  
  try {
    // Prepare email content
    const mailOptions = {
      from: '"HealthWise Team" <noreply@healthwise.com>',
      to: email,
      subject: 'Welcome to HealthWise!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Welcome to HealthWise!</h2>
          <p>Hello ${displayName || 'there'},</p>
          <p>We're excited to have you join our platform.</p>
          <p>At HealthWise, we provide various health services including:</p>
          <ul>
            <li>AI Health Chat</li>
            <li>Symptom Analysis</li>
            <li>Find Hospitals</li>
          </ul>
          <p>If you have any questions, please contact us at <a href="mailto:support@healthwise.com">support@healthwise.com</a>.</p>
          <p>Best regards,<br>The HealthWise Team</p>
        </div>
      `
    };

    // Send the email
    if (!transporter) {
      console.warn('Email transporter not configured; skipping welcome email.');
    } else {
      await transporter.sendMail(mailOptions);
    }
    
    console.log(`Welcome email sent to ${email}`);
    
    // Optionally, you can update a custom claim or user metadata to track that the welcome email was sent
    await admin.auth().setCustomUserClaims(uid, { welcomeEmailSent: true });
    
    return null;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return null;
  }
});

// HTTPS callable to (re)send welcome email after login if not already sent
exports.sendWelcomeEmailOnLogin = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const uid = context.auth.uid;

  try {
    // Read current custom claims to check if welcome was already sent
    const userRecord = await admin.auth().getUser(uid);
    const alreadySent = userRecord.customClaims && userRecord.customClaims.welcomeEmailSent;

    if (alreadySent) {
      return { status: 'already_sent' };
    }

    const email = userRecord.email;
    const displayName = userRecord.displayName;

    const mailOptions = {
      from: '"HealthWise Team" <noreply@healthwise.com>',
      to: email,
      subject: 'Welcome to HealthWise!'
    };

    // Simple text fallback to avoid HTML-only
    mailOptions.text = `Hello ${displayName || 'there'},\n\nWelcome to HealthWise! We are excited to have you on board.\n\nBest regards,\nThe HealthWise Team`;

    if (!transporter) {
      console.warn('Email transporter not configured; skipping welcome email on login.');
    } else {
      await transporter.sendMail(mailOptions);
    }

    await admin.auth().setCustomUserClaims(uid, { ...(userRecord.customClaims || {}), welcomeEmailSent: true });

    return { status: 'sent' };
  } catch (error) {
    console.error('Error sending welcome email on login:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send welcome email.');
  }
});