const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.errorCode === undefined) {
    return res.status(500).send({ message: "Internal server error" });
  }
  return res.status(err.errorCode).send({ message: err.message });
};

module.exports = errorHandler;
