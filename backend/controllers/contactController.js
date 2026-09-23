import nodemailer from 'nodemailer';

// Helper to escape HTML characters in email bodies to prevent template injection
const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Singleton Nodemailer Transporter
let cachedTransporter = null;
const getTransporter = () => {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.zeptomail.in',
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_PORT === '465' || process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return cachedTransporter;
};

// @desc    Submit contact form and send email notification
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  const { name, email, phone, service, businessType, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }

  try {
    const transporter = getTransporter();

    const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@codefusionprojects.in';
    const fromName = process.env.SMTP_FROM_NAME || 'Code Fusion Projects';

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || 'Not provided');
    const safeService = escapeHtml(service || 'General Inquiry');
    const safeBusinessType = escapeHtml(businessType || 'Not specified');
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: 'codefusionprojects@gmail.com',
      replyTo: email,
      subject: `New Contact Request: ${safeService} for ${safeBusinessType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-top: 0;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Name:</strong></td><td style="padding: 8px 0; color: #1e293b;">${safeName}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px 0; color: #1e293b;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td><td style="padding: 8px 0; color: #1e293b;">${safePhone}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Service:</strong></td><td style="padding: 8px 0; color: #1e293b;">${safeService}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Business Type:</strong></td><td style="padding: 8px 0; color: #1e293b;">${safeBusinessType}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <h4 style="color: #334155; margin-bottom: 8px;">Message:</h4>
          <p style="color: #1e293b; line-height: 1.6; background-color: #f8fafc; padding: 12px; border-radius: 6px;">${safeMessage}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email send error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
};
