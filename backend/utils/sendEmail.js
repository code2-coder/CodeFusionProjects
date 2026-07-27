import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.zeptomail.in',
  port: process.env.SMTP_PORT || 465,
  secure: process.env.SMTP_SECURE === 'true' || true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendAuthOTP = async (email, otp) => {
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@codefusionprojects.in';
  const fromName = process.env.SMTP_FROM_NAME || 'Code Fusion Projects';

  try {
    if (!process.env.SMTP_PASS) {
      console.log('\n=============================================');
      console.log(`🔐 LOCAL DEV OTP FOR ${email}: ${otp}`);
      console.log('=============================================\n');
      console.log('Authentication email skipped (No valid SMTP_PASS set).');
      return { success: true, message: 'Email skipped - no API key' };
    }
    
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: 'Code Fusion Projects - Your Login Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #2563eb;">Your Authentication Code 🚀</h2>
          <p style="color: #334155; font-size: 16px;">Please use the following One-Time Password (OTP) to sign in or register to your account:</p>
          <div style="text-align: center; margin: 40px 0;">
            <div style="background-color: #f1f5f9; border: 2px dashed #cbd5e1; padding: 20px; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1e293b; display: inline-block;">
              ${otp}
            </div>
          </div>
          <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes. Do not share this code with anyone.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Code Fusion Projects. All rights reserved.</p>
        </div>
      `
    });

    console.log('OTP email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    console.log('\n=============================================');
    console.log(`🔐 LOCAL DEV OTP FOR ${email}: ${otp}`);
    console.log('=============================================\n');
    console.log('Failing over to local dev mode due to email error.');
    return { success: true, message: 'Fell back to local dev logging' };
  }
};
