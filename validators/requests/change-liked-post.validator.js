
const userId = (obj) => {
  if (!(obj.hasOwnProperty("userId") &&
    typeof obj.userId === "string")) {
    throw { status: 400, msg: "Invalid userId value" };
  }
};

const isLiked = (obj) => {
  if (!(obj.hasOwnProperty("isLiked") &&
    typeof obj.isLiked === "boolean")) {
    throw { status: 400, msg: "Invalid isLiked value" };
  }
};

module.exports = Object.freeze({
  userId,
  isLiked,
});