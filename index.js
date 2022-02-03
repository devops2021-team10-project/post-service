require('dotenv').config();

const brokerConsumer = require('./msgBroker/consumer');
const brokerProducer = require('./msgBroker/producer');
const { formatResponse } = require('./msgBroker/utils');

const postService = require('./services/post.service');


const POST_SERVICE_QUEUES = {
  findPostById:               "postService_findPostById",
  findAllPostsILike:          "postService_findAllPostsILike",
  findAllPostsIDislike:       "postService_findAllPostsIDislike",
  findPostsByUserId:          "postService_findPostsByUserId",
  create:                     "postService_create",
  createCampaign:             "postService_createCampaign",

  changeLikedPost:            "postService_changeLikedPost",
  changeDislikedPost:         "postService_changeDislikedPost",

  createComment:              "postService_createComment"
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

  consumerChannel.assertQueue(POST_SERVICE_QUEUES.findAllPostsILike, {exclusive: false}, (error2, q) => {
    consumerChannel.consume(POST_SERVICE_QUEUES.findAllPostsILike, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        const posts = await postService.findAllPostsILike({ userId: data.userId });
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

  consumerChannel.assertQueue(POST_SERVICE_QUEUES.findAllPostsIDislike, {exclusive: false}, (error2, q) => {
    consumerChannel.consume(POST_SERVICE_QUEUES.findAllPostsIDislike, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        const posts = await postService.findAllPostsIDislike({ userId: data.userId });
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

  consumerChannel.assertQueue(POST_SERVICE_QUEUES.createCampaign, {exclusive: false}, (error2, q) => {
    consumerChannel.consume(POST_SERVICE_QUEUES.createCampaign, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        const post = await postService.insertPostWithCampaign({
          authorUserId: data.authorUserId,
          postData: data.postData,
          imageInfo: data.imageInfo,
          campaignData: data.createCampaign,
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

  consumerChannel.assertQueue(POST_SERVICE_QUEUES.createComment, {exclusive: false}, (error2, q) => {
    consumerChannel.consume(POST_SERVICE_QUEUES.createComment, async (msg) => {
      const data = JSON.parse(msg.content);
      let respData = null;
      try {
        const newComment = await postService.createComment({
          postId: data.postId,
          authorId: data.authorId,
          text: data.text
        });
        respData = formatResponse({data: newComment, err: null});
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