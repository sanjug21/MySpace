const Joi = require('joi');

const userSchemaJoi = Joi.object({
  name: Joi.string().min(2).max(100).required().trim(),
  email: Joi.string().email().required().trim().lowercase(),
  phone: Joi.string().trim().allow(''),
  password: Joi.string().min(8).required(),
  dob: Joi.date().allow(null,''),
  posts: Joi.array().items(Joi.string().hex().length(24)),
  contacts: Joi.array().items(Joi.string().hex().length(24)),
  notes: Joi.array().items(Joi.string().hex().length(24)),
});

const validateUser = (req, res, next) => {
  const { error } = userSchemaJoi.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (req.body.email && !emailRegex.test(req.body.email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  next();
};

module.exports = validateUser;