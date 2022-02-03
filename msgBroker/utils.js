
const serviceName = process.env.SERVICE_NAME;

const formatResponse = ({data, err }) => {
  let respData = {};
  if (!err) {
    respData = {
      isError: false,
      error: null,
      data,
      serviceName,
      timestamp: Date.now()
    };
  } else {
    respData = {
      isError: true,
      error: err,
      data:  null,
      serviceName,
      timestamp: Date.now()
    }
  }
  return respData;
}


module.exports = Object.freeze({
  formatResponse
})