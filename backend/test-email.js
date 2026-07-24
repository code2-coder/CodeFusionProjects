import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const apiKey = process.env.RESEND_API_KEY;
console.log('Using API Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NONE');

const resend = new Resend(apiKey);
const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
// We will send TO the exact same email as the fromEmail, assuming it's their test email, 
// OR to a dummy if fromEmail is onboarding@resend.dev. 
// Wait, if fromEmail is codefusionprojects@gmail.com, we send to codefusionprojects@gmail.com.
const toEmail = fromEmail === 'onboarding@resend.dev' ? 'codefusionprojects@gmail.com' : fromEmail;

console.log('Sending FROM:', fromEmail);
console.log('Sending TO:', toEmail);

async function test() {
  try {
    const data = await resend.emails.send({
      from: `Test <${fromEmail}>`,
      to: [toEmail],
      subject: 'Test Email',
      html: '<p>This is a test</p>'
    });
    console.log('Success!', data);
  } catch (error) {
    console.error('Failed to send:', error);
  }
}

test();
