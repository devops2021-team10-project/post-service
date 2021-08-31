
const userId = (obj) => {
  if (!(obj.hasOwnProperty("userId") &&
    typeof obj.userId === "string")) {
    throw { status: 400, msg: "Invalid userId value" };
  }
};

const isDisliked = (obj) => {
  if (!(obj.hasOwnProperty("isDisliked") &&
    typeof obj.isDisliked === "boolean")) {
    throw { status: 400, msg: "Invalid isDisliked value" };
  }
};

module.exports = Object.freeze({
  userId,
  isDisliked,
});