const Africastalking = require("africastalking");

const africastalking = Africastalking({
  apiKey: process.env.AT_API_KEY,    // your Africa’s Talking API key
  username: process.env.AT_USERNAME, // your Africa’s Talking username
});

const sms = africastalking.SMS;

const sendSMS = (phone, message) => {
  return sms.send({
    to: [phone],
    message,
  });
};

module.exports = sendSMS;
