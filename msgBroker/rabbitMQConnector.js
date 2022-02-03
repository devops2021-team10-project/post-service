const amqp = require("amqplib/callback_api");

const RABBITMQ_URL = process.env.RABBITMQ_URL;

const channelInit = () => {
  return new Promise((resolve, reject) => {
    amqp.connect(RABBITMQ_URL, (error0, connection) => {
      if (error0) {
        reject(error0);
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          reject(error1);
        }
        resolve(channel);
      });
    });
  });
};

module.exports = Object.freeze({
  channelInit
});