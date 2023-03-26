import * as Joi from 'joi';

// debo crearme un Schema de validación
export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required(),
  PORT:Joi.number().default(3005),
  DEFAULT_LIMIT: Joi.number().default(6)
})