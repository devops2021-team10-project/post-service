const { channelInit } = require('./rabbitMQConnector');
const replyQueue = process.env.REPLY_QUEUE;


let channelSingleton = null;
const producerInit = async () => {
  if (channelSingleton === null) {
    channelSingleton = await channelInit();
    console.log("PRODUCER CHANNEL CREATED on RabbitMQ");
  }
}
const getChannel = async () => {
  if (channelSingleton === null) {
    await producerInit();
  }
  return channelSingleton;
}

const produceWithReply = async ({ queue, content, correlationId }) => {
  const channel = await getChannel();
  channel.sendToQueue(queue,
    Buffer.from(JSON.stringify(content)), {
      correlationId: correlationId,
      replyTo: replyQueue
  });
};

const produceWithNoReply = async ({ queue, content }) => {
  const channel = await getChannel();
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(content)));
}


module.exports = Object.freeze({
  producerInit,
  getChannel,
  produceWithReply,
  produceWithNoReply
});


