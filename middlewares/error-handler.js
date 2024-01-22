const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.message === "Internal server error") {
    return res.status(500).send({ message: "Internal server error" });
  }
  return res.status(err.statusCode).send({ message: err.message });
};

module.exports = errorHandler;
