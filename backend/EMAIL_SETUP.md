# Email Notification Setup Guide

This guide will help you configure email notifications for clock in/out events in your attendance system.

## Prerequisites

1. Install nodemailer:
```bash
npm install nodemailer
```

## Email Configuration

### Option 1: Gmail (Recommended for testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Update your `.env` file**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-digit-app-password
```

### Option 2: Other SMTP Providers

For other providers (Outlook, Yahoo, custom SMTP), update your `.env` file:
```env
SMTP_HOST=your-smtp-host.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

## Testing Email Configuration

1. **Start your backend server**
2. **Test email sending** using the test endpoint:
```bash
curl -X POST http://localhost:3000/api/attendance/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "John Doe",
    "action": "clockIn"
  }'
```

## How It Works

### Automatic Email Triggers

1. **Manual Attendance Recording**: When attendance is recorded via API
2. **Biometric Device Sync**: When logs are fetched from ZKTeco device
3. **Clock In**: Green-themed email with checkmark
4. **Clock Out**: Yellow-themed email with house icon

### Email Content

Each email includes:
- Employee name
- Timestamp
- Location (Main Office or Biometric Device)
- Professional HTML formatting
- System branding

### Email Templates

- **Clock In**: Green background, checkmark icon
- **Clock Out**: Yellow background, house icon
- Both include employee details and timestamp

## Troubleshooting

### Common Issues

1. **Authentication Failed**:
   - Check your email and password
   - For Gmail, ensure you're using an App Password, not your regular password

2. **Connection Timeout**:
   - Check your internet connection
   - Verify SMTP host and port settings

3. **Emails Not Sending**:
   - Check server logs for error messages
   - Verify email configuration in `.env` file

### Testing Steps

1. Test email configuration:
```javascript
const { testEmailConfig } = require('./utils/emailService');
const result = await testEmailConfig();
console.log(result);
```

2. Test individual email:
```javascript
const { sendAttendanceNotification } = require('./utils/emailService');
const result = await sendAttendanceNotification(
  'test@example.com',
  'Test User',
  'clockIn',
  new Date(),
  'Test Location'
);
```

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for sensitive information
- Consider using a dedicated email service for production (SendGrid, Mailgun, etc.)
- Implement rate limiting for email sending to prevent abuse 