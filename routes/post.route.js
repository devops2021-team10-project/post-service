const express = require('express');
const postRouter = express.Router();

const { handleError } = require('./../utils/error');

const Role = require('./../utils/role');

const authenticate = require('./../middleware/authenticate.middleware');
const authorize = require('./../middleware/authorize.middleware');

const { postValidator, validate, rValid, changeMutedProfileRequestValidator, changeBlockedProfileRequestValidator} = require("../validators/validators");
const postService = require("./../services/post.service");

const { upload } = require('./../utils/upload');

const changeLikedPostRequestValidator = require('./../validators/requests/change-liked-post.validator');
const changeDislikedPostRequestValidator = require('./../validators/requests/change-disliked-post.validator');
const changeSavedPostRequestValidator = require('./../validators/requests/change-saved-post.validator');


postRouter.get(
  '/:postId',
  authenticate,
  authorize([Role.regular]),
  async (req, res, next) => {
    try {
      const postId = req.params.postId;
      if (!postId) {
        throw {status: 400, msg: "Bad request, cannot get post"}
      }
      const post = await postService.findPostById({ id: postId });

      return res.status(200).json(post);
    } catch(err) {
      handleError(err, res);
    }
});

postRouter.get(
  '/allByUser/:userId',
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        throw {status: 400, msg: "Bad request, cannot get user"}
      }
      const posts = await postService.findAllPostsByUserId({ authorUserId: userId });
      return res.status(200).json(posts);
    } catch(err) {
      handleError(err, res);
    }
  });

postRouter.get(
  '/:postId/image',
  authenticate,
  authorize([Role.regular]),
  async (req, res, next) => {
    try {
      const postId = req.params.postId;
      if (!postId) {
        throw {status: 400, msg: "Bad request, cannot get post"}
      }
      const post = await postService.findPostById({ id: postId });

      const file = post.imageInfo.path;
      res.download(file);
    } catch(err) {
      handleError(err, res);
    }
  });


postRouter.get(
  '/group/:group',
  authenticate,
  authorize([Role.regular]),
  async (req, res, next) => {
    try {
      const userId = req.user.id
      const group = req.params.group;

      console.log(group);
      if (!group) {
        throw {status: 400, msg: "Bad request, wrong user group"}
      }

      let posts = await postService.findAllByGroupAndUserId({ group, userId });
      if (!posts) {
        posts = [];
      }
      return res.status(200).json(posts);
    } catch(err) {
      handleError(err, res);
    }
});


postRouter.post(
  '',
  authenticate,
  authorize([Role.regular]),
  upload.single('image'),
  async (req, res, next) => {
    try {
      req.body = JSON.parse(JSON.stringify(req.body));
      if (!req.body.hasOwnProperty('postdata')) {
        throw { status: 400, msg: "No post data" }
      }
      const postData = JSON.parse(req.body["postdata"]);

      const validPostData = validate(postData, [
        postValidator.hashtags,
        postValidator.description
      ]);

      const insertedPost = await postService.insertPost({
        authorUserId: req.user.id,
        postData: validPostData,
        imageInfo: req.file,
      });
      return res.status(200).json(insertedPost);
    } catch(err) {
      handleError(err, res);
    }
  });


// Update user
postRouter.put(
  '/:postId',
  authenticate,
  authorize([Role.regular]),
  async (req, res, next) => {
    try {
      const postId = req.params.postId;
      if (!postId) {
        throw {status: 400, msg: "Bad request"};
      }

      const validUserData = validate(req.body, [
        postValidator.description
      ]);

      const updatedPost = await postService.updatePost({ id: postId, postData: validUserData });
      return res.status(200).json(updatedPost);
    } catch(err) {
      handleError(err, res);
    }
  });

// Delete user
postRouter.delete(
  '/:postId',
  authenticate,
  authorize([Role.regular]),
  async (req, res, next) => {
    try {
      const postId = req.params.postId;
      if (!postId) {
        throw {status: 400, msg: "Bad request, cannot get post"}
      }

      await postService.deletePost({ id: postId });
      return res.status(200).send("");
    } catch(err) {
      handleError(err, res);
    }
  });


// Change liked post
postRouter.put(
  '/:postId/change-liked',
  authenticate,
  authorize([Role.regular]),
  async (req, res, next) => {
    try {
      const postId = req.params.postId;
      if (!postId) {
        throw {status: 400, msg: "Bad request, cannot get post"}
      }

      const validData = validate(req.body, [
        changeLikedPostRequestValidator.userId,
        changeLikedPostRequestValidator.isLiked,
      ]);
      await postService.changeLikedPost({
        userId: validData.userId,
        toLikePostId: postId,
        isLiked: validData.isLiked,
      });
      return res.status(200).send("");
    } catch(err) {
      handleError(err, res);
    }
  });

// Change disliked post
postRouter.put(
  '/:postId/change-disliked',
  authenticate,
  authorize([Role.regular]),
  async (req, res, next) => {
    try {
      const postId = req.params.postId;
      if (!postId) {
        throw {status: 400, msg: "Bad request, cannot get post"}
      }

      const validData = validate(req.body, [
        changeDislikedPostRequestValidator.userId,
        changeDislikedPostRequestValidator.isDisliked,
      ]);
      await postService.changeDislikedPost({
        userId: validData.userId,
        toDislikePostId: postId,
        isDisliked: validData.isDisliked,
      });
      return res.status(200).send("");
    } catch(err) {
      handleError(err, res);
    }
  });

// Change saved post
postRouter.put(
  '/:postId/change-saved',
  authenticate,
  authorize([Role.regular]),
  async (req, res, next) => {
    try {
      const postId = req.params.postId;
      if (!postId) {
        throw {status: 400, msg: "Bad request, cannot get post"}
      }

      const validData = validate(req.body, [
        changeSavedPostRequestValidator.userId,
        changeSavedPostRequestValidator.isSaved,
      ]);
      await postService.changeSavedPost({
        userId: validData.userId,
        toSavePostId: postId,
        isSaved: validData.isSaved,
      });
      return res.status(200).send("");
    } catch(err) {
      handleError(err, res);
    }
  });

module.exports = postRouter;