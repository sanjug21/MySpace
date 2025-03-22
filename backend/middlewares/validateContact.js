

const Joi = require('joi');

const contactSchemaJoi = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.object({
    personal: Joi.string().email().allow('').trim().lowercase(),
    work: Joi.string().email().allow('').trim().lowercase(),
  }).allow(null),
  phone: Joi.object({
    personal: Joi.string().allow('').trim(),
    work: Joi.string().allow('').trim(),
  }).allow(null),
  address: Joi.string().allow('').trim(),
  dob: Joi.date().allow(null,''),
});

const validateContact = (req, res, next) => {
  const { error } = contactSchemaJoi.validate(req.body);
  if (error) {
   
    
    return res.status(400).json({ error: error.details[0].message });
  }
  req.body.userId = req.user.userId;
  next();
};

module.exports = validateContact;