const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateClothingItem = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),

      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
    })
    .unknown(true),
});

const validateUserInfo = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    avatar: Joi.string().uri().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),

    email: Joi.string().email().required().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled in',
    }),

    password: Joi.string().required(),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": 'The "email" field must be a valid email address',
      "string.empty": 'The "email" field must be filled in',
    }),

    password: Joi.string().required(),
  }),
});

const validateIDs = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().messages({
      "string.empty": 'The "itemId" parameter must be provided',
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUserInfo,
  validateAuthentication,
  validateIDs,
};
