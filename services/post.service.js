const postDb = require('../data-access/post-db');

const findPostById = async ({ id } = {}) => {
  return await postDb.findById({id});
};

const findAllPostsByUserId = async ({ authorUserId } = {}) => {
  return await postDb.findAllByUserId({ authorUserId });
};

const findAllByGroupAndUserId = async ({ group, userId } = {}) => {
  return await postDb.findAllByGroupAndUserId({ group, userId });
};

const insertPost = async ({ authorUserId, postData, imageInfo } = {}) => {
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


const updatePost = async ({ id, postData } = {}) => {
  const userUpdateData = {
    description: postData.description
  };
  await postDb.update({ id, data: userUpdateData });
  return await findPostById({ id });
};

const changeLikedPost = async ({ userId, toLikePostId, isLiked } = {}) => {
  if (isLiked) {
    await postDb.addToPostSet({
      postId: toLikePostId,
      toAddId: userId,
      setName: "likedBy"
    });
  } else {
    await postDb.removeFromPostSet({
      postId: toLikePostId,
      toRemoveId: userId,
      setName: "likedBy"
    });
  }
}

const changeDislikedPost = async ({ userId, toDislikePostId, isDisliked } = {}) => {
  if (isDisliked) {
    await postDb.addToPostSet({
      postId: toDislikePostId,
      toAddId: userId,
      setName: "dislikedBy"
    });
  } else {
    await postDb.removeFromPostSet({
      postId: toDislikePostId,
      toRemoveId: userId,
      setName: "dislikedBy"
    });
  }
}

const changeSavedPost = async ({ userId, toSavePostId, isSaved } = {}) => {
  if (isSaved) {
    await postDb.addToPostSet({
      postId: toSavePostId,
      toAddId: userId,
      setName: "savedBy"
    });
  } else {
    await postDb.removeFromPostSet({
      postId: toSavePostId,
      toRemoveId: userId,
      setName: "savedBy"
    });
  }
}

const deletePost = async ({ id }) => {
  await postDb.deleteById({ id });
}


module.exports = Object.freeze({
  findPostById,
  findAllPostsByUserId,
  findAllByGroupAndUserId,

  insertPost,
  updatePost,
  changeLikedPost,
  changeDislikedPost,
  changeSavedPost,

  deletePost,

});