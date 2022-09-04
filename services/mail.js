// NODEMAILER + MAILGUN

const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

const mailgunAuth = {
  auth: {
    api_key: process.env.API_KEY,
    domain: process.env.DOMAIN,
  },
};

const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));

// MAIL TO GENERATE OTP
module.exports.sendMailTo = async (params) => {
  try {
    let info = await smtpTransport.sendMail({
      from: "2019041054@mmmut.ac.in",
      to: params.to,
      subject: "Verification OTP | Overpay",
      html: `
      <div style="font-family: Helvetica,Arial,sans-serif; min-width:1000px; overflow:auto; line-height:2">
      <div style="margin:50px auto; width:70%; padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Overpay Inc</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing Overpay Inc. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
        <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${params.OTP}</h2>
        <h4 style="font-family: Helvetica,Arial,sans-serif ;min-width:1000px; overflow:auto; line-height:2; color: grey">If you have not created this account, please ignore!</h4>
        <p style="font-size:0.9em;">Regards,<br />Overpay Inc</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Overpay Inc</p>
        </div>
      </div>
    </div>
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// MAIL TO RESET PASSWORD
module.exports.sendResetMail = async (params) => {
  try {
    let info = await smtpTransport.sendMail({
      from: "2019041054@mmmut.ac.in",
      to: params.to,
      subject: "Reset Password Link | Overpay",
      html: `
      <div style="font-family: Helvetica,Arial,sans-serif; min-width:1000px; overflow:auto; line-height:2">
      <div style="margin:50px auto; width:70%; padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Overpay Inc</a>
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing Overpay Inc. Use the following Link for reset of your password. Link is valid for 5 minutes</p>
        <a href="${params.link}" style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px; text-decoration: none">Reset Password</a>
        <h4 style="font-family: Helvetica,Arial,sans-serif ;min-width:1000px; overflow:auto; line-height:2; color: grey">If you have not done this, please report!</h4>
        <p style="font-size:0.9em;">Regards,<br />Overpay Inc</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Overpay Inc</p>
        </div>
      </div>
    </div>
      `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};
