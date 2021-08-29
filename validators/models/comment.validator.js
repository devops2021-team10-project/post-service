/*
{
  id,
  authorId,
  comment,

  createdAt
  deletedAt
}
 */

const comment = (obj) => {
  if (!(obj.hasOwnProperty("comment") &&
    typeof obj.comment === "string") &&
    obj.comment.length > 1) {
    throw { status: 400, msg: "Invalid comment" };
  }
};

module.exports = Object.freeze({
  comment
});