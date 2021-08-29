const { handleError } = require('../utils/error');
const axios = require('axios');

const microserviceToken = process.env.MICROSERVICE_TOKEN;

const findUserByJWT = async ({ jwt } = {}) => {
  const response = await axios.post(
    'http://localhost:5001/user-service-api/auth/regular-user/find-by-jwt-value',
    { jwt }
  );

  if (response.status !== 200) {
    throw response.data;
  }
  return { ...response.data };
};

const authenticate = async (req, res, next) => {
  const msTokenHeader = req.headers['microservice-token'];
  if (msTokenHeader === microserviceToken) {
    req.isServiceCall = true;
    return next();
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(400).json({ msg: "Bad token." });
  }

  const jwtToken = authHeader && authHeader.split(' ')[1]
  if (!jwtToken) {
    return res.status(400).json({ msg: "Bad token." });
  }

  let userData = null;
  try {
    userData = await findUserByJWT({ jwt: jwtToken });
  } catch (err) {
    if (err.hasOwnProperty("response") && err.response.status !== 500) {
      return handleError({status: err.response.status, msg: err.response.data.msg}, res);
    }
    return handleError(err, res);
  }

  req.user = userData;
  req.isServiceCall = false;

  return next();
};

module.exports = authenticate;