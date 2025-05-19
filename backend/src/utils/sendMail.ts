import transporter from "../config/nodemailer.config";

interface MailOptions {
  to: string;
  subject: string;
  username?: string;
  otp?: number;
  resetPasswordLink?: string;
}

export const sendRegistrationEmail = async ({
  to,
  subject,
  username,
}: MailOptions): Promise<void> => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Welcome to SmartScan</title>
          </head>
          <body style="margin: 0; font-family: Arial, sans-serif; background-color: #f4f6f8; color: #333;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                    <tr>
                      <td align="center" style="background-color: #3B82F6; padding: 30px 20px; color: #ffffff;">
                        <h1 style="margin: 0; font-size: 28px;">Welcome to SmartScan!</h1>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 30px 20px;">
                        <h2 style="font-size: 22px; margin-top: 0;">Hello 👋, ${username}</h2>
                        <p style="font-size: 16px; line-height: 1.5;">
                          Thank you for registering with <strong>SmartScan</strong> — your AI-powered assistant for analyzing and optimizing resumes.
                        </p>
                        <p style="font-size: 16px; line-height: 1.5;">You’re now one step closer to landing your dream job! Use SmartScan to:</p>
                        <ul style="font-size: 16px; padding-left: 20px;">
                          <li>Get personalized resume analysis</li>
                          <li>Match your resume with job descriptions</li>
                          <li>Receive actionable improvement tips powered by AI</li>
                        </ul>
                        <p style="font-size: 16px; line-height: 1.5;">Click the button below to get started:</p>
                        <p>
                          <a href="https://smart-scan-eight.vercel.app" 
                              style="display: inline-block; margin-top: 15px; background-color: #3B82F6; color: white; text-decoration: none; 
                                    padding: 12px 20px; border-radius: 6px; font-weight: bold;">
                            Go to Home
                          </a>
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style="background-color: #f0f2f5; padding: 20px; font-size: 13px; color: #777;">
                        Need help? Contact us at <a href="mailto:support@smartscan.ai" style="color: #3B82F6; text-decoration: none;">support@smartscan.ai</a><br>
                        © 2025 SmartScan. All rights reserved.
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOtpEmail = async ({
  to,
  subject,
  otp
}: MailOptions): Promise<void> => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Login OTP</title>
  </head>
  <body style="background-color: #f5f9ff; margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, sans-serif;">
    <div style="background-color: #3B82F6; color: white; text-align: center; padding: 16px 0; font-size: 20px; font-weight: bold;">
      Sign in to SmartScan
    </div>

    <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); padding: 40px; color: #1e2a45;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">Login Verification</h1>
        <p style="margin-top: 8px;">Use the OTP below to sign in to your account</p>
      </div>

      <div style="background-color: #eef4ff; border: 1px dashed #2563eb; color: #1e40af; font-size: 28px; letter-spacing: 4px; text-align: center; padding: 20px; margin: 30px 0; border-radius: 8px; font-weight: bold;">
        ${otp}
      </div>

      <p style="text-align: center; color: #374151; margin-top: 0;">
        This OTP is valid for the next <strong>5 minutes</strong>.<br />
        Please do not share it with anyone.
      </p>

      <div style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
        If you did not request this OTP, please ignore this email.<br />
        &copy; 2025 SmartScan, All rights reserved.
      </div>
    </div>
  </body>
</html>
`
  };
  await transporter.sendMail(mailOptions);
};

export const sendForgotPasswordEmail = async ({
  to,
  subject,
  username,
  resetPasswordLink
}: MailOptions): Promise<void> => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Password - SmartScan</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f6f8fa; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f6f8fa;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
                <tr>
                  <td align="center" style="padding: 30px; border-bottom: 1px solid #eaeaea;">
                    <h1 style="margin: 0; font-size: 24px; color: #333;">SmartScan</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <p style="font-size: 16px; color: #333; margin: 0 0 16px;">Hi <strong>${username}</strong>,</p>
                    <p style="font-size: 16px; color: #333; margin: 0 0 16px;">
                      We received a request to reset your SmartScan password. Click the button below to set a new password:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${resetPasswordLink}" style="background-color: #3b82f6; color: #ffffff; padding: 14px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                        Reset My Password
                      </a>
                    </div>
                    <p style="font-size: 14px; color: #666; margin: 0 0 8px;">
                      This link will expire in 15 minutes. If you didn't request this, you can safely ignore this email.
                    </p>
                    <p style="font-size: 14px; color: #666; margin: 0;">
                      Need help? Contact us at <a href="mailto:support@smartscan.com" style="color: #3b82f6; text-decoration: none;">support@smartscan.com</a>.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px; background-color: #f0f0f0; font-size: 12px; color: #999;">
                    © 2025 SmartScan Inc. • <a href="https://smart-scan-eight.vercel.app" style="color: #999; text-decoration: none;">smart-scan-eight.vercel.app</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};