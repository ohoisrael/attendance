const Joi = require('joi');

const employeeSchema = Joi.object({
  empNo: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),
  telephone: Joi.string().allow(''),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  dob: Joi.date().required(),
  departmentId: Joi.number().integer().required(),
  unitId: Joi.number().integer().allow(null),
  position: Joi.string().required(),
  highestQualification: Joi.string().allow(''),
  address: Joi.string().required(),
  country: Joi.string().required(),
  startDate: Joi.date().required(),
  maritalStatus: Joi.string().valid('single', 'married', 'divorced', 'widowed').allow(''),
  childrenNo: Joi.number().integer().min(0).default(0),
  bankName: Joi.string().allow(''),
  accountNo: Joi.string().allow(''),
  bio: Joi.string().allow(''),
  fingerprintId: Joi.string().allow(''),
  profilePicture: Joi.string().allow(''),
  role: Joi.string().valid('admin', 'hr', 'employee').allow('')
});

const validateEmployee = (data) => {
  return employeeSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateEmployee
};