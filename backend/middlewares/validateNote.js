const Joi = require('joi');

const noteSchemaJoi = Joi.object({
  title: Joi.string().trim().max(100).allow(''),
  description: Joi.string().required().trim(),
});

const validateNote = (req, res, next) => {
  const { error,value } = noteSchemaJoi.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req.body.title = value.title || "Untitled";
  req.body.userId = req.user.userId;
  next();
};

module.exports = validateNote;