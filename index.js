require('dotenv').config();

const brokerConsumer = require('./msgBroker/consumer');
const brokerProducer = require('./msgBroker/producer');
const { formatResponse } = require('./msgBroker/utils');

const postService = require('./services/post.service');


const POST_SERVICE_QUEUES = {
  findPostById:               "postService_findPostById",
  findPostsByUserId:          "postService_findPostsByUserId",
  create:                     "postService_create",

  changeLikedPost:            "postService_changeLikedPost",
  changeDislikedPost:         "postService_changeDislikedPost",
};


const declareQueues = (consumerChannel, producerChannel) => {

  consumerChannel.assertQueue(POST_SERVICE_QUEUES.findPostById, {exclusive: false}, (error2, q) => {
    consumerChannel.consume(POST_SERVICE_QUEUES.findPostById, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        const post = await postService.findPostById({ id: data.postId });
        respData = formatResponse({data: post, err: null});
      } catch (err) {
        respData = formatResponse({data: null, err});
      }

      producerChannel.sendToQueue(msg.properties.replyTo,
        Buffer.from(JSON.stringify(respData)), {
          correlationId: msg.properties.correlationId
        });
      consumerChannel.ack(msg);
    });
  });

  consumerChannel.assertQueue(POST_SERVICE_QUEUES.findPostsByUserId, {exclusive: false}, (error2, q) => {
    consumerChannel.consume(POST_SERVICE_QUEUES.findPostsByUserId, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        const posts = await postService.findAllPostsByUserId({ authorUserId: data.userId });
        respData = formatResponse({data: posts, err: null});
      } catch (err) {
        respData = formatResponse({data: null, err});
      }

      producerChannel.sendToQueue(msg.properties.replyTo,
        Buffer.from(JSON.stringify(respData)), {
          correlationId: msg.properties.correlationId
        });
      consumerChannel.ack(msg);
    });
  });

  consumerChannel.assertQueue(POST_SERVICE_QUEUES.create, {exclusive: false}, (error2, q) => {
    consumerChannel.consume(POST_SERVICE_QUEUES.create, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        const post = await postService.insertPost({
          authorUserId: data.authorUserId,
          postData: data.postData,
          imageInfo: data.imageInfo
        });
        respData = formatResponse({data: post, err: null});
      } catch (err) {
        respData = formatResponse({data: null, err});
      }

      producerChannel.sendToQueue(msg.properties.replyTo,
        Buffer.from(JSON.stringify(respData)), {
          correlationId: msg.properties.correlationId
        });
      consumerChannel.ack(msg);
    });
  });

  consumerChannel.assertQueue(POST_SERVICE_QUEUES.changeLikedPost, {exclusive: false}, (error2, q) => {
    consumerChannel.consume(POST_SERVICE_QUEUES.changeLikedPost, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        await postService.changeLikedPost({
          userId: data.userId,
          toLikePostId: data.toLikePostId,
          isLiked: data.isLiked
        });
        respData = formatResponse({data: {}, err: null});
      } catch (err) {
        respData = formatResponse({data: null, err});
      }

      producerChannel.sendToQueue(msg.properties.replyTo,
        Buffer.from(JSON.stringify(respData)), {
          correlationId: msg.properties.correlationId
        });
      consumerChannel.ack(msg);
    });
  });


  consumerChannel.assertQueue(POST_SERVICE_QUEUES.changeDislikedPost, {exclusive: false}, (error2, q) => {
    consumerChannel.consume(POST_SERVICE_QUEUES.changeDislikedPost, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        await postService.changeDislikedPost({
          userId: data.userId,
          toDislikePostId: data.toDislikePostId,
          isDisliked: data.isDisliked
        });
        respData = formatResponse({data: {}, err: null});
      } catch (err) {
        respData = formatResponse({data: null, err});
      }

      producerChannel.sendToQueue(msg.properties.replyTo,
        Buffer.from(JSON.stringify(respData)), {
          correlationId: msg.properties.correlationId
        });
      consumerChannel.ack(msg);
    });
  });

}


// Connect, make queues and start
  Promise.all([brokerConsumer.getChannel(), brokerProducer.getChannel(), brokerConsumer.initReplyConsumer()]).then(values => {
    try {
      declareQueues(values[0], values[1]);
      console.log("Post Service - Ready");
    } catch (err) {
      console.log(err);
    }
  });