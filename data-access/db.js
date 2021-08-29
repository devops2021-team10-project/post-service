const { MongoClient } = require('mongodb');

const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, retryWrites: false, poolSize: 3 });

const makeDb = async () => {
  if (!client.isConnected()) {
    await client.connect();
  }
  return { db: client.db(dbName), client: client };
}

module.exports = Object.freeze({
  makeDb
});