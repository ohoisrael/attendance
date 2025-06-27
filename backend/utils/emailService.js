const nodemailer = require('nodemailer');

// Email configuration - you'll need to update these with your SMTP settings
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  }
};

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Email templates
const createClockInEmail = (employeeName, timestamp, location = 'Main Office') => ({
  subject: `Clock In Notification - ${employeeName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Attendance Notification</h2>
      <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #27ae60; margin: 0;">✅ Clock In Recorded</h3>
        <p style="margin: 10px 0;"><strong>Employee:</strong> ${employeeName}</p>
        <p style="margin: 10px 0;"><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
        <p style="margin: 10px 0;"><strong>Location:</strong> ${location}</p>
      </div>
      <p style="color: #7f8c8d; font-size: 14px;">
        This is an automated notification from your attendance system.
      </p>
    </div>
  `
});

const createClockOutEmail = (employeeName, timestamp, location = 'Main Office') => ({
  subject: `Clock Out Notification - ${employeeName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Attendance Notification</h2>
      <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #f39c12; margin: 0;">🏠 Clock Out Recorded</h3>
        <p style="margin: 10px 0;"><strong>Employee:</strong> ${employeeName}</p>
        <p style="margin: 10px 0;"><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
        <p style="margin: 10px 0;"><strong>Location:</strong> ${location}</p>
      </div>
      <p style="color: #7f8c8d; font-size: 14px;">
        This is an automated notification from your attendance system.
      </p>
    </div>
  `
});

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: to,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send attendance notification
const sendAttendanceNotification = async (employeeEmail, employeeName, action, timestamp, location = 'Main Office') => {
  try {
    let emailContent;
    
    if (action === 'clockIn') {
      emailContent = createClockInEmail(employeeName, timestamp, location);
    } else if (action === 'clockOut') {
      emailContent = createClockOutEmail(employeeName, timestamp, location);
    } else {
      throw new Error('Invalid action. Must be "clockIn" or "clockOut"');
    }

    const result = await sendEmail(employeeEmail, emailContent.subject, emailContent.html);
    return result;
  } catch (error) {
    console.error('Error sending attendance notification:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email configuration is valid');
    return { success: true };
  } catch (error) {
    console.error('Email configuration error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  sendAttendanceNotification,
  testEmailConfig
}; 