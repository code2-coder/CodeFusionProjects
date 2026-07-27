import dotenv from 'dotenv';

dotenv.config();

export const sendAuthOTP = async (email, otp) => {
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@codefusionprojects.in';
  const fromName = process.env.SMTP_FROM_NAME || 'Code Fusion Projects';
  
  // In ZeptoMail, the SMTP password is often the Send Mail Token
  const zeptoToken = process.env.ZEPTOMAIL_TOKEN || process.env.SMTP_PASS;

  try {
    if (!zeptoToken) {
      console.log('\n=============================================');
      console.log(`🔐 LOCAL DEV OTP FOR ${email}: ${otp}`);
      console.log('=============================================\n');
      console.log('Authentication email skipped (No valid ZEPTOMAIL_TOKEN or SMTP_PASS set).');
      return { success: true, message: 'Email skipped - no API key' };
    }

    // Ensure the token has the correct ZeptoMail prefix for REST API calls
    const authHeader = zeptoToken.startsWith('Zoho-enczapikey') 
      ? zeptoToken 
      : `Zoho-enczapikey ${zeptoToken}`;

    const payload = {
      from: {
        address: fromEmail,
        name: fromName
      },
      to: [
        {
          email_address: {
            address: email
          }
        }
      ],
      subject: 'Code Fusion Projects - Your Login Code',
      htmlbody: `
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
    };

    // Make the REST API call over HTTPS (Port 443 - never blocked by Render)
    const response = await fetch('https://api.zeptomail.in/v1.1/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('ZeptoMail API Error Response:', JSON.stringify(responseData, null, 2));
      throw new Error(`ZeptoMail API failed with status: ${response.status}`);
    }

    console.log('OTP email sent successfully via REST API:', responseData.message || 'Success');
    return { success: true, data: responseData };
    
  } catch (error) {
    console.error('🔥 Error sending email via ZeptoMail REST API:', error.message);
    
    // Fallback to local dev logging
    console.log('\n=============================================');
    console.log(`🔐 LOCAL DEV OTP FOR ${email}: ${otp}`);
    console.log('=============================================\n');
    console.log('Failing over to local dev mode due to email error.');
    
    return { success: true, message: 'Fell back to local dev logging' };
  }
};
