# Firebase Cloud Functions Deployment Guide

This guide explains how to deploy the welcome email Cloud Function for HealthWise.

## Prerequisites

1. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

## Configuration Steps

1. Navigate to the project root directory:
```bash
cd healthhabit-ai-buddy
```

2. Set up environment variables for email credentials:

   Create a `.env` file in the `functions` directory with your email credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

   **Important Security Note**: 
   - For Gmail, use an App Password instead of your regular password
   - Never commit this file to version control

3. Set environment variables in Firebase:
```bash
firebase functions:config:set email.user="your-email@gmail.com" email.password="your-app-password"
```

## Deployment

Deploy the Cloud Functions:
```bash
firebase deploy --only functions
```

## Testing

After deployment:
1. Register a new user in the application
2. The Cloud Function will automatically trigger and send a welcome email
3. Check the Firebase Functions logs for any errors:
```bash
firebase functions:log
```

## Troubleshooting

If emails are not being sent:
1. Check Firebase Functions logs for errors
2. Verify your email credentials are correct
3. For Gmail, ensure "Less secure app access" is enabled or use an App Password
4. Check if your email service has sending limits or restrictions