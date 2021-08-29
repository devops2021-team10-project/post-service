const postValidator = require('./models/post.validator');
const commentValidator = require('./models/comment.validator');

const validate = (obj = {}, toValidate = []) => {
  const newObj = {};
  toValidate.forEach((elem) => {
    elem(obj);
    newObj[elem.name] = obj[elem.name];
  });
  return newObj;
};


module.exports = Object.freeze({
  postValidator: {
    hashtags: postValidator.hashtags,
    description: postValidator.description
  },
  commentValidator: {
    comment: commentValidator.comment
  },
  validate
});