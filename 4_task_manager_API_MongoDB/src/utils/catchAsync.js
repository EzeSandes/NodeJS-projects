export default fn => {
  // I need to return a middleware
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
