const postDb = require('../data-access/post-db');
const parse = require('date-fns/parse');

const findPostById = async ({ id } = {}) => {
  return await postDb.findById({id});
};

const findAllPostsILike = async ({ userId }) => {
  return await postDb.findAllPostsILike({ userId });
}

const findAllPostsIDislike = async ({ userId }) => {
  return await postDb.findAllPostsIDislike({ userId });
}

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

    isCampaign:                   false,
    campaign:                     null,

    likedBy:                      [],
    dislikedBy:                   [],
    savedBy:                      [],
    comments:                     [],

    createdAt:                    Date.now(),
    deletedAt:                    null,
  };

  return await postDb.insert({data: postCreateData});
};

const insertPostWithCampaign = async ({ authorUserId, postData, imageInfo, campaignData } = {}) => {
  const postCreateData = {
    authorUserId:                 authorUserId,
    imageInfo:                    imageInfo,
    hashtags:                     postData.hashtags,
    description:                  postData.description,

    isCampaign:                   true,
    campaign:                     {
      start: parse(campaignData.start, 'dd.MM.yyyy.', new Date()),
      end: parse(campaignData.end, 'dd.MM.yyyy.', new Date()),

      genders: campaignData.genders,
      ageRangeStart: campaignData.ageRangeStart,
      ageRangeEnd: campaignData.ageRangeEnd,

      link: campaignData.link
    },

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

const createComment = async ({ postId, authorId, text }) => {
  return await postDb.createComment({ postId, authorId, text });
}

const changeLikedPost = async ({ userId, toLikePostId, isLiked } = {}) => {
  await changeDislikedPost({userId, toDislikePostId: toLikePostId, isDisliked: false});
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
    await changeLikedPost({userId, toLikePostId: toDislikePostId, isLiked: false });
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
  findAllPostsILike,
  findAllPostsIDislike,
  findAllPostsByUserId,
  findAllByGroupAndUserId,

  insertPost,
  insertPostWithCampaign,
  updatePost,
  createComment,
  changeLikedPost,
  changeDislikedPost,
  changeSavedPost,

  deletePost,

});