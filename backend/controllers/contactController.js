import nodemailer from 'nodemailer';
import Contact from '../models/Contact.js';

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

// @desc    Submit contact form, save to DB, and send email notification
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  const { name, email, phone, service, businessType, message } = req.body;

  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';
  const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
  const trimmedService = typeof service === 'string' ? service.trim() : 'Website Development';
  const trimmedBusinessType = typeof businessType === 'string' ? businessType.trim() : 'web';
  const trimmedMessage = typeof message === 'string' ? message.trim() : '';

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name, email, and message are required fields.' 
    });
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide a valid email address.' 
    });
  }

  let savedContact = null;
  try {
    // 1. Always persist submission in MongoDB first so no inquiry is ever lost
    savedContact = await Contact.create({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      service: trimmedService,
      businessType: trimmedBusinessType,
      message: trimmedMessage,
      emailSent: false,
    });
  } catch (dbErr) {
    console.error('Contact DB save error:', dbErr.message);
  }

  try {
    const transporter = getTransporter();

    const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@codefusionprojects.in';
    const fromName = process.env.SMTP_FROM_NAME || 'Code Fusion Projects';

    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safePhone = escapeHtml(trimmedPhone || 'Not provided');
    const safeService = escapeHtml(trimmedService || 'General Inquiry');
    const safeBusinessType = escapeHtml(trimmedBusinessType || 'Not specified');
    const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br/>');

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: 'codefusionprojects@gmail.com',
      replyTo: trimmedEmail,
      subject: `New Contact Request: ${safeService} (${safeName})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #2563eb; margin-top: 0; border-bottom: 2px solid #eff6ff; padding-bottom: 12px;">New Contact Inquiry Received</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr><td style="padding: 10px 0; color: #64748b; width: 140px;"><strong>Client Name:</strong></td><td style="padding: 10px 0; color: #1e293b; font-weight: 600;">${safeName}</td></tr>
            <tr><td style="padding: 10px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 10px 0; color: #1e293b;"><a href="mailto:${safeEmail}" style="color: #2563eb;">${safeEmail}</a></td></tr>
            <tr><td style="padding: 10px 0; color: #64748b;"><strong>Phone:</strong></td><td style="padding: 10px 0; color: #1e293b;">${safePhone}</td></tr>
            <tr><td style="padding: 10px 0; color: #64748b;"><strong>Service:</strong></td><td style="padding: 10px 0; color: #1e293b;"><span style="background-color: #eff6ff; color: #1d4ed8; padding: 4px 10px; border-radius: 6px; font-size: 13px;">${safeService}</span></td></tr>
            <tr><td style="padding: 10px 0; color: #64748b;"><strong>Business Type:</strong></td><td style="padding: 10px 0; color: #1e293b;">${safeBusinessType}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <h4 style="color: #334155; margin-bottom: 8px;">Project Details / Message:</h4>
          <p style="color: #1e293b; line-height: 1.6; background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">${safeMessage}</p>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; text-align: center;">Submitted from Code Fusion Projects Contact Form</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    if (savedContact) {
      savedContact.emailSent = true;
      await savedContact.save();
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully! Our team will get back to you shortly.' 
    });
  } catch (error) {
    console.error('Email send error:', error.message);

    // If message was saved to database, reassure the user their message is safe
    if (savedContact) {
      return res.status(200).json({ 
        success: true, 
        message: 'Your message has been received! Our team will get in touch with you shortly.' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again or reach us at codefusionprojects@gmail.com.' 
    });
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
export const getContactSubmissions = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    console.error('Fetch contacts error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching contact inquiries' });
  }
};
