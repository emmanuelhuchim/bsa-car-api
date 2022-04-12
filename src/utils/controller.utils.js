const HTTP_RESPONSES = {
  serverError: {
    message: "Internal server error",
    code: 500,
  },
  notFound: {
    message: "Not found",
    code: 404,
  },
  ok: {
    message: "Ok",
    code: 200,
  },
  created: {
    message: "Created",
    code: 201,
  },
};

module.exports = {
  HTTP_RESPONSES,
};
