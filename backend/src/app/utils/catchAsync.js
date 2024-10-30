const catchAsync = (fn) => {
  return (req, res, next) => {
    try {
      Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    } catch (err) {
      next(err);
    }
  };
};

export default catchAsync;
