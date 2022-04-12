const Joi = require("@hapi/joi");

const carCreateValidator = {
  payload: Joi.object({
    vin: Joi.string().required(),
    model: Joi.number().required(),
    make: Joi.string().required(),
    color: Joi.string().required(),
    state: Joi.string().required(),
  }),
};

const carUpdateValidator = {
  payload: Joi.object({
    vin: Joi.string().optional(),
    model: Joi.number().optional(),
    make: Joi.string().optional(),
    color: Joi.string().optional(),
    state: Joi.string().optional(),
  }),
};

module.exports = {
  carCreateValidator,
  carUpdateValidator,
};
