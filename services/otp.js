const otpGenerator = require("otp-generator");

module.exports.generateOTP = () => {
  const OTP = otpGenerator.generate(5, {
    digits: "true",
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  return OTP;
};
