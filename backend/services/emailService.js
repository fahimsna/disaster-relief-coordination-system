const nodemailer = require("nodemailer");

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Send Thank-You Email to Donor
const sendThankYouEmail = async (donorEmail, donorName, amount, campaignTitle, donationId) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: donorEmail,
      subject: `Thank You for Your Donation to ${campaignTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #00ADB5;">
            <h1 style="color: #00ADB5; font-size: 28px;">DRRCS</h1>
            <p style="color: #666; font-size: 14px;">Disaster Response & Relief Coordination System</p>
          </div>
          
          <div style="padding: 20px 0;">
            <h2 style="color: #222831; font-size: 22px;">Thank You for Your Donation! 🙏</h2>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Dear <strong>${donorName}</strong>,
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              We are deeply grateful for your generous donation of 
              <strong style="color: #00ADB5; font-size: 18px;">৳${amount}</strong> 
              to the <strong>${campaignTitle}</strong> campaign.
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Your contribution will help us provide critical relief to those affected by disasters.
              Every donation, no matter the size, makes a difference in saving lives and rebuilding communities.
            </p>
            
            <div style="background: #f5f7fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0; color: #333; font-size: 14px;">
                <strong>Donation Reference ID:</strong> ${donationId}
              </p>
              <p style="margin: 5px 0; color: #333; font-size: 14px;">
                <strong>Amount:</strong> ৳${amount}
              </p>
              <p style="margin: 5px 0; color: #333; font-size: 14px;">
                <strong>Campaign:</strong> ${campaignTitle}
              </p>
              <p style="margin: 5px 0; color: #333; font-size: 14px;">
                <strong>Date:</strong> ${new Date().toLocaleDateString()}
              </p>
            </div>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              This email serves as your <strong>digital donation receipt</strong>. Please keep it for your records.
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              With gratitude,<br>
              <strong style="color: #00ADB5;">DRRCS Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} DRRCS. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
      status: "sent",
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      success: false,
      status: "failed",
      errorMessage: error.message,
      timestamp: new Date(),
    };
  }
};

module.exports = { sendThankYouEmail };