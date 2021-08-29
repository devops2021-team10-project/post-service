/*
{
  id,
  authorUserId,
  imagePath,
  hashtags: []
  description,
  likedBy: [],
  dislikedBy: [],
  savedBy: [],
  comments: [],

  createdAt
  deletedAt
}
 */

const hashtags = (obj) => {
  const hashtagPattern = /^#+[a-zA-Z0-9(_)]+$/;
  if (!obj.hasOwnProperty("hashtags")) {
    throw { status: 400, msg: "Invalid hashtag" };
  }
  for (let ht of obj.hashtags) {
    if (!(typeof ht === "string" &&
    hashtagPattern.test(ht))) {
      throw { status: 400, msg: "Invalid hashtag: " + ht };
    }
  }
};

const description = (obj) => {
  if (!(obj.hasOwnProperty("description") &&
    typeof obj.description === "string")) {
    throw { status: 400, msg: "Invalid description" };
  }
};

module.exports = Object.freeze({
  hashtags,
  description,
})