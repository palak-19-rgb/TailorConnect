const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, subject, order) => {
  await transporter.sendMail({
    from: `"Tailor App ✂️" <${process.env.EMAIL_USER}>`,
    to: to, 
    subject: subject, 
    html: `
    <div style="font-family: Arial; padding:20px; background:#f9f3e8;">
      
      <h2 style="color:#b8963f;">✨ Tailor Atelier</h2>
      
      <p>Dear <b>${order.name}</b>,</p>

      <p>Your outfit <b>${order.outfit}</b> is now:</p>

      <h3 style="color:#b8963f;">${order.status}</h3>

      <p>📅 Delivery Date: ${order.deliveryDate}</p>

      ${
        order.status === "Ready"
          ? "<p style='color:green;'>🎉 Ready for pickup!</p>"
          : "<p style='color:blue;'>✅ Delivered successfully!</p>"
      }

      <hr/>

      <p style="font-size:12px; color:gray;">
        Thank you for choosing us ✂️
      </p>

    </div>
    `
  });
};

module.exports = sendMail;