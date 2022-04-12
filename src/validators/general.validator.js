const failAction = async (request, h, error) => {
  return error.isJoi
    ? h.response(error.details[0]).takeover()
    : h.response(error).takeover();
};

module.exports = {
  failAction,
};
