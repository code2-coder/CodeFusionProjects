import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const sendVerificationEmail = async (email, name, verificationToken) => {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verifyLink = `${frontendUrl}/verify/${verificationToken}`;

  try {
    if (!resend) {
      console.log('Verification email skipped (No RESEND_API_KEY set). OTP:', verificationToken);
      return { success: true, message: 'Email skipped - no API key' };
    }
    const data = await resend.emails.send({
      from: `Code Fusion Projects <${fromEmail}>`,
      to: [email],
      subject: 'Welcome to Code Fusion Projects - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #2563eb;">Welcome to Code Fusion Projects, ${name}! 🚀</h2>
          <p style="color: #334155; font-size: 16px;">We're thrilled to have you on board. To get started, please verify your email address by entering the following One-Time Password (OTP):</p>
          <div style="text-align: center; margin: 40px 0;">
            <div style="background-color: #f1f5f9; border: 2px dashed #cbd5e1; padding: 20px; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1e293b; display: inline-block;">
              ${verificationToken}
            </div>
          </div>
          <p style="color: #64748b; font-size: 14px;">This OTP is required to activate your account. Do not share this code with anyone.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Code Fusion Projects. All rights reserved.</p>
        </div>
      `,
    });

    console.log('Verification email sent:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
};
