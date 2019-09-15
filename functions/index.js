const sendResponse = (statusCode, message) => {
  const response = {
    statusCode: statusCode,
    message,
    headers: { "Content-Type": "text/plain" }
  };
  return response;
};

module.exports = { sendResponse };
