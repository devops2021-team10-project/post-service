const express = require('express');
const postRouter = express.Router();

const { handleError } = require('./../utils/error');

const Role = require('./../utils/role');

const authenticate = require('./../middleware/authenticate.middleware');
const authorize = require('./../middleware/authorize.middleware');

const { postValidator, validate } = require("../validators/validators");
const postService = require("./../services/post.service");

const { upload } = require('./../utils/upload');


postRouter.get(
  '/:postId',
  authenticate,
  authorize([Role.regular]),
  async (req, res, next) => {
    try {
      return res.status(200).json({msg: "hello"});
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

module.exports = postRouter;