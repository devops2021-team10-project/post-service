const postDb = require('../data-access/post-db');


const findPostById = async ({ id } = {}) => {
  return await postDb.findById({id});
};

const insertPost = async ({ authorUserId, postData, imageInfo } = {}) => {
  console.log(postData);
  const postCreateData = {
    authorUserId:                 authorUserId,
    imageInfo:                    imageInfo,
    hashtags:                     postData.hashtags,
    description:                  postData.description,

    likedBy:                      [],
    dislikedBy:                   [],
    savedBy:                      [],
    comments:                     [],

    createdAt:                    Date.now(),
    deletedAt:                    null,
  };

  return await postDb.insert({data: postCreateData});
};

module.exports = Object.freeze({
  findPostById,
  insertPost
});