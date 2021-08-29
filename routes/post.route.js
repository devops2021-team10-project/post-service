const express = require('express');
const postRouter = express.Router();

const { handleError } = require('./../utils/error');

const Role = require('./../utils/role');

const authenticate = require('./../middleware/authenticate.middleware');
const authorize = require('./../middleware/authorize.middleware');


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

module.exports = postRouter;