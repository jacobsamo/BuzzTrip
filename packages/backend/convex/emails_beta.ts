import { z } from "zod";
import { resend } from "./emails";
import { zodInternalMutation } from "./helpers";

export const sendBetaConfirmationEmail = zodInternalMutation({
  args: {
    firstName: z.string(),
    email: z.string(),
    token: z.string(),
  },
  handler: async (ctx, { firstName, email, token }) => {
    // Escape HTML to prevent injection
    const escapeHtml = (text: string) =>
      text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const name = escapeHtml(firstName);
    const confirmationUrl = `https://buzztrip.co/confirm-waitlist?token=${token}`;

    await resend.sendEmail(ctx, {
      from: "Jacob Samorowski <info@buzztrip.co>",
      to: `${name} <${email}>`,
      subject: "Confirm Your BuzzTrip Beta Signup",
      replyTo: ["jacob.samorowski@buzztrip.co"],
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin:0;padding:0;background-color:rgb(245,243,229);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 20px">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:rgb(255,255,246);border-radius:12px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1)">
          <tr>
            <td style="padding:40px">
              <img src="https://di867tnz6fwga.cloudfront.net/brand-kits/5c37fc6e-f7cf-42bd-9edb-2b116f9c8cd8/primary/e79aab6e-3705-411e-8375-afbf42103906.png" alt="BuzzTrip" width="96" height="96" style="display:block;margin:0 auto 24px;border-radius:50%"/>

              <div style="background:linear-gradient(135deg, rgb(44,120,115) 0%, rgb(28,75,72) 100%);padding:24px;border-radius:12px;text-align:center;margin-bottom:24px">
                <h1 style="margin:0 0 8px 0;font-size:32px;font-weight:700;color:white">Confirm Your Beta Signup</h1>
                <p style="margin:0;font-size:18px;color:rgba(255,255,255,0.9)">You're one step away from early access</p>
              </div>

              <p style="font-size:18px;color:rgb(4,19,27);margin:24px 0;text-align:center;line-height:1.6">Hey ${name}! 👋</p>

              <p style="font-size:16px;color:rgb(4,19,27);margin:24px 0;line-height:1.6">Thanks for your interest in joining the BuzzTrip beta program! We're excited to have you on board.</p>

              <p style="font-size:16px;color:rgb(4,19,27);margin:24px 0;line-height:1.6">To complete your signup, please confirm your email address by clicking the button below:</p>

              <div style="text-align:center;margin:32px 0">
                <a href="${confirmationUrl}" style="background-color:rgb(44,120,115);color:white;padding:16px 32px;border-radius:8px;font-size:18px;font-weight:600;text-decoration:none;display:inline-block">Confirm Email & Join Beta →</a>
              </div>

              <div style="background-color:rgb(245,243,229);border-radius:12px;padding:24px;margin:24px 0">
                <p style="margin:0 0 16px 0;font-size:16px;color:rgb(4,19,27);line-height:1.6"><strong>What happens next?</strong></p>
                <p style="margin:8px 0;font-size:16px;color:rgb(4,19,27);line-height:1.6">1. Confirm your email</p>
                <p style="margin:8px 0;font-size:16px;color:rgb(4,19,27);line-height:1.6">2. Complete a quick 3-minute questionnaire</p>
                <p style="margin:8px 0;font-size:16px;color:rgb(4,19,27);line-height:1.6">3. Get instant beta access!</p>
              </div>

              <p style="font-size:16px;color:rgb(4,19,27);margin:24px 0;line-height:1.6">As a beta member, you'll get early access to all new features, a direct line to our team, and the chance to shape BuzzTrip's future.</p>

              <p style="font-size:14px;color:rgb(107,114,128);margin:24px 0;line-height:1.6;text-align:center">This link will expire in 30 days. If you didn't request to join the beta program, you can safely ignore this email.</p>

              <p style="font-size:16px;color:rgb(4,19,27);margin:24px 0;line-height:1.6">See you inside! 🚀</p>

              <p style="font-size:16px;color:rgb(4,19,27);font-weight:600;margin:24px 0">Jacob Samorowski<br/>Founder, BuzzTrip</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;background-color:rgb(245,243,229);text-align:center;border-top:1px solid rgb(230,228,215)">
              <p style="font-size:12px;color:rgb(4,19,27);margin:8px 0"><strong>BuzzTrip</strong> - Create Custom Maps</p>
              <p style="font-size:12px;color:rgb(4,19,27);margin:8px 0">© 2025 BuzzTrip</p>
              <p style="font-size:14px;margin:8px 0">
                <a href="https://buzztrip.co/legal/privacy" style="color:rgb(107,114,128);text-decoration:underline">Privacy Policy</a> •
                <a href="https://buzztrip.co/legal/terms" style="color:rgb(107,114,128);text-decoration:underline">Terms of Service</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });
  },
});

export const sendBetaWelcomeEmail = zodInternalMutation({
  args: {
    firstName: z.string().optional(),
    email: z.string(),
    whatsappOptIn: z.boolean(),
    questionnaireToken: z.string(),
  },
  handler: async (ctx, { firstName, email, whatsappOptIn, questionnaireToken }) => {
    // Escape HTML to prevent injection
    const escapeHtml = (text: string) =>
      text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const name = firstName ? escapeHtml(firstName) : "there";

    // Get WhatsApp group link from environment or skip section
    const whatsappGroupUrl = process.env.WHATSAPP_GROUP_URL;
    const whatsappSection =
      whatsappOptIn && whatsappGroupUrl
        ? `<div style="background-color:rgb(37,211,102);border-radius:12px;padding:24px;margin:32px 0;text-align:center">
          <p style="font-size:18px;color:white;font-weight:600;margin:0 0 16px 0">Join Our WhatsApp Community</p>
          <p style="font-size:14px;color:white;margin:0 0 16px 0">Connect with other beta testers, get instant updates, and share feedback directly with our team!</p>
          <a href="${whatsappGroupUrl}" style="background-color:white;color:rgb(37,211,102);padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;display:inline-block">Join WhatsApp Group</a>
        </div>`
        : "";

    await resend.sendEmail(ctx, {
      from: "Jacob Samorowski <info@buzztrip.co>",
      to: firstName ? `${escapeHtml(firstName)} <${email}>` : email,
      subject: "Welcome to BuzzTrip Beta - You're In!",
      replyTo: ["jacob.samorowski@buzztrip.co"],
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin:0;padding:0;background-color:rgb(245,243,229);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 20px">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:rgb(255,255,246);border-radius:12px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1)">
          <tr>
            <td style="padding:40px">
              <img src="https://di867tnz6fwga.cloudfront.net/brand-kits/5c37fc6e-f7cf-42bd-9edb-2b116f9c8cd8/primary/e79aab6e-3705-411e-8375-afbf42103906.png" alt="BuzzTrip" width="96" height="96" style="display:block;margin:0 auto 24px;border-radius:50%"/>

              <div style="background:linear-gradient(135deg, rgb(44,120,115) 0%, rgb(28,75,72) 100%);padding:24px;border-radius:12px;text-align:center;margin-bottom:24px">
                <h1 style="margin:0 0 8px 0;font-size:32px;font-weight:700;color:white">Welcome to Beta!</h1>
                <p style="margin:0;font-size:18px;color:rgba(255,255,255,0.9)">You're among the first to shape BuzzTrip's future</p>
              </div>

              <p style="font-size:18px;color:rgb(4,19,27);margin:24px 0;text-align:center;line-height:1.6">Hey ${name}! 👋</p>

              <p style="font-size:16px;color:rgb(4,19,27);margin:24px 0;line-height:1.6">I'm Jacob, founder of BuzzTrip, and I'm incredibly excited to have you join our beta program! You're not just a user – you're a crucial part of shaping what BuzzTrip becomes.</p>

              <p style="font-size:16px;color:rgb(4,19,27);margin:24px 0;line-height:1.6">As a beta member, you get:</p>

              <div style="background-color:rgb(245,243,229);border-radius:12px;padding:24px;margin:24px 0">
                <p style="margin:16px 0;font-size:16px;color:rgb(4,19,27)"><strong>⭐ Early access to all new features</strong></p>
                <p style="margin:16px 0;font-size:16px;color:rgb(4,19,27)"><strong>💬 Direct line to our development team</strong></p>
                <p style="margin:16px 0;font-size:16px;color:rgb(4,19,27)"><strong>🎁 Special perks and exclusive beta features</strong></p>
                <p style="margin:16px 0;font-size:16px;color:rgb(4,19,27)"><strong>🗳️ Vote on upcoming features and roadmap</strong></p>
              </div>

              <div style="background-color:rgb(254,243,199);border:2px solid rgb(251,191,36);border-radius:12px;padding:24px;margin:24px 0">
                <h2 style="margin:0 0 16px 0;font-size:20px;color:rgb(4,19,27)">🎉 You're All Set!</h2>
                <p style="margin:0 0 16px 0;font-size:16px;color:rgb(4,19,27);line-height:1.6">Thanks for completing the questionnaire! Your feedback will help us build the perfect mapping tool for you.</p>
              </div>

              ${whatsappSection}

              <div style="text-align:center;margin:32px 0">
                <a href="https://buzztrip.co/app" style="background-color:rgb(44,120,115);color:white;padding:16px 32px;border-radius:8px;font-size:16px;font-weight:600;text-decoration:none;display:inline-block">Start Creating Maps</a>
              </div>

              <p style="font-size:16px;color:rgb(4,19,27);margin:24px 0;line-height:1.6">Your feedback is invaluable. Whether it's a bug, a feature request, or just thoughts on your experience – I want to hear it all. Reply to this email anytime!</p>

              <p style="font-size:16px;color:rgb(4,19,27);margin:24px 0;line-height:1.6">Let's build something amazing together! 🚀</p>

              <p style="font-size:16px;color:rgb(4,19,27);font-weight:600;margin:24px 0">Jacob Samorowski<br/>Founder, BuzzTrip</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;background-color:rgb(245,243,229);text-align:center;border-top:1px solid rgb(230,228,215)">
              <p style="font-size:12px;color:rgb(4,19,27);margin:8px 0"><strong>BuzzTrip</strong> - Create Custom Maps</p>
              <p style="font-size:12px;color:rgb(4,19,27);margin:8px 0">© 2025 BuzzTrip</p>
              <p style="font-size:14px;margin:8px 0">
                <a href="https://buzztrip.co/legal/privacy" style="color:rgb(107,114,128);text-decoration:underline">Privacy Policy</a> •
                <a href="https://buzztrip.co/legal/terms" style="color:rgb(107,114,128);text-decoration:underline">Terms of Service</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });
  },
});
