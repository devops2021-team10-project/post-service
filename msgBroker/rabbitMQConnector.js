const amqp = require("amqplib/callback_api");

const channelInit = () => {
  return new Promise((resolve, reject) => {
    amqp.connect('amqp://user:123456@localhost', (error0, connection) => {
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