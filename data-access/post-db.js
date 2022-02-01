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

const findAllByUserId = async ({ authorUserId }) => {
  const { db } = await makeDb();
  const result = await db.collection('posts')
    .find({ authorUserId, deletedAt: null })
    .sort({ createdAt: 1});
  const found = await result.toArray();
  if (found.length === 0) {
    return null;
  }
  let normalArray = [];
  for (let e of found) {
    const { _id: id, ...info } = e;
    normalArray.push({ id, ...info });
  }
  return normalArray;
};


const findAllByGroupAndUserId = async ({ group, userId }) => {
  const { db } = await makeDb();
  const result = await db.collection('posts')
    .find({ [group]: { $in: [userId] } })
    .sort({ createdAt: 1});
  const found = await result.toArray();
  if (found.length === 0) {
    return null;
  }

  let normalArray = [];
  for (let e of found) {
    const { _id: id, ...info } = e;
    normalArray.push({ id, ...info });
  }
  return normalArray;
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

const update = async ({ id, data }) => {
  const { db } = await makeDb();
  const result = await db.collection('posts').updateOne(
    {
      _id: id,
      deletedAt: null
    }, {
      $set: {
        ...data
      }
    }
  );
  if(result.matchedCount !== 1) {
    throw "Post not found for update ops";
  }
};

const addToPostSet = async ({ postId, toAddId, setName }) => {
  const { db } = await makeDb();
  await db.collection('posts').updateOne(
    {
      _id: postId,
      deletedAt: null
    },
    {
      $addToSet: { [setName]: toAddId }
    }
  );
};

const removeFromPostSet = async ({ postId, toRemoveId, setName }) => {
  const { db } = await makeDb();
  await db.collection('posts').updateOne(
    {
      _id: postId,
      deletedAt: null
    },
    {
      $pull: { [setName]: toRemoveId }
    }
  );
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
  findAllByUserId,
  findAllByGroupAndUserId,

  insert,
  update,
  addToPostSet,
  removeFromPostSet,

  deleteById,
});