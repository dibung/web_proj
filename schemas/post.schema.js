const Joi = require('joi');

exports.createPostSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  content: Joi.string().required(),
  category: Joi.string().optional(),
});

