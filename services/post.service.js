const postDb = require('../data-access/post-db');


const findPostById = async ({ id } = {}) => {
  return await postDb.findById({id});
};

const registerRegularUser = async ({ postData, image } = {}) => {
  const postCreateData = {
    authorUserId:                 postData.authorUserId,
    imagePath:                    postData.imagePath,
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
  registerRegularUser
});