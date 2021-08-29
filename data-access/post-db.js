const Id = require('../utils/id');
const { makeDb } = require('./db');

const findById = async ({ id: _id }) => {
  const { db } = await makeDb();
  const result = await db.collection('posts').find({ _id, deletedAt: null });
  const found = await result.toArray();
  if (found.length === 0) {
    return null;
  }
  const { _id: id, ...info } = found[0];
  return { id, ...info };
};

const insert = async ({ data }) => {
  try {
    const id = Id.makeId();
    const { db } = await makeDb();
    const result = await db
      .collection('posts')
      .insertOne({ _id: id, ...data });
    const { _id, ...insertedUser } = result.ops[0];
    return { id: _id, ...insertedUser };
  } catch(err) {
    throw err;
  }
};

const deleteById = async ({ id }) => {
  const { db } = await makeDb();
  const res = await db.collection('posts').updateOne(
    {
      _id: id,
      deletedAt: null
    }, {
      $set: {
        deletedAt: Date.now()
      }
    }
  );
  if(res.matchedCount !== 1) {
    throw "Post not found for delete ops";
  }
};


module.exports = Object.freeze({
  findById,

  insert,

  deleteById,
});