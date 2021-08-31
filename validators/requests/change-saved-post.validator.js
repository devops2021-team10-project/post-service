
const userId = (obj) => {
  if (!(obj.hasOwnProperty("userId") &&
    typeof obj.userId === "string")) {
    throw { status: 400, msg: "Invalid userId value" };
  }
};

const isSaved = (obj) => {
  if (!(obj.hasOwnProperty("isSaved") &&
    typeof obj.isSaved === "boolean")) {
    throw { status: 400, msg: "Invalid isSaved value" };
  }
};

module.exports = Object.freeze({
  userId,
  isSaved,
});