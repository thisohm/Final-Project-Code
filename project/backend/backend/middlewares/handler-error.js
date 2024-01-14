exports.get404 = (req, res, next) => {
  const error = new Error('Not found.');
  error.statusCode = 404;
  next(error);
};

exports.get500 = (error, req, res, next) => {
  const data = error.data;

  console.log('error => ', error);

  // if (err instanceof GeneralError) {
  //   return res.status(err.getCode()).json({
  //     status: 'error',
  //     message: err.message
  //   });
  // }

  res.status(error.statusCode || 500);
  res.json({ error: responseDetail(error) });

};

function responseDetail(errorInfo) {
  let { statusCode, message } = errorInfo;
  return { statusCode, message };
}
