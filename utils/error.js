const handleError = (err, res) => {
  if(err instanceof Object && err.hasOwnProperty("status") && err.hasOwnProperty("msg")) {
    return res.status(err.status).json({ msg: err.msg });
  } else {
    console.log(err);
    return res.status(500).json({ msg: String(err) });
  }
}

module.exports = Object.freeze({ handleError });