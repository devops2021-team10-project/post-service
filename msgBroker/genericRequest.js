const Id = require("../utils/id");

const brokerProducer = require('./producer');
const eventEmitter = require('./eventEmittler');

const timeoutError = "Consumer timeout!";
const timeout = ({ prom, time, clearFunc, exception }) => {
  let timer;
  return Promise.race([
    prom,
    new Promise((_r, reject) => timer = setTimeout(() => { clearFunc(); reject(); }, time, exception))
  ]).finally(() => clearTimeout(timer));
}


const sendRequest = async ({ request, queue }) => {
  const correlationId = Id.makeId();

  const waitForResponse = new Promise((resolve, _reject) => {
    eventEmitter.once(String(correlationId), (msg) => {
      resolve(JSON.parse(msg.content));
    });
    brokerProducer.produceWithReply({
      queue: queue,
      content: request,
      correlationId: correlationId
    });
  });

  return await timeout({
    prom: waitForResponse,
    time:  3000,
    clearFunc: () => eventEmitter.removeAllListeners(String(correlationId)),
    exception: timeoutError
  });
};

module.exports = sendRequest;