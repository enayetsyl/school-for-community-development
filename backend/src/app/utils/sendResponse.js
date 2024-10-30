const sendSuccessResponse = (res, data) => {
  res.status(data?.statusCode || 200).json({
    success: true,
    message: data.message || 'Operation successful',
    meta: data.meta,
    data: data.data,
  });
};

const sendErrorResponse = (res, error) => {
  res.status(error?.statusCode || 500).json({
    success: false,
    message: error.message || 'An error occurred',
    meta: error.meta,
  });
};

export { sendSuccessResponse, sendErrorResponse };
