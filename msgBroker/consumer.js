const { channelInit } = require('./rabbitMQConnector');
const eventEmitter = require('./eventEmittler');

const replyQueue = process.env.REPLY_QUEUE;


let channelSingleton = null;
const consumerInit = async () => {
  if (channelSingleton === null) {
    channelSingleton = await channelInit();
    console.log("CONSUMER CHANNEL CREATED on RabbitMQ");
  }
}
const getChannel = async () => {
  if (channelSingleton === null) {
    await consumerInit();
  }
  return channelSingleton;
}

const initReplyConsumer = () => new Promise(async (resolve, reject) => {
  try {
    const channel = await getChannel();
    channel.assertQueue(replyQueue, {exclusive: false}, () => {
      channel.consume(replyQueue, (msg) => {
        eventEmitter.emit(String(msg.properties.correlationId), msg);
      }, {
        noAck: true
      });
      console.log("reply-CONSUMER connected to RabbitMQ");
      resolve(channel);
    });
  } catch (err) {
    reject(err);
  }
});


module.exports = Object.freeze({
  consumerInit,
  getChannel,
  initReplyConsumer,
});
