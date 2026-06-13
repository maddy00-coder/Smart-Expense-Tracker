export function validateRequest(schema, property = 'body') {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const hasRequiredFieldError = error.details.some((detail) =>
        ['any.required', 'string.empty'].includes(detail.type)
      );
      const message = hasRequiredFieldError
        ? 'Please fill all required fields.'
        : error.details[0]?.message || 'Validation failed';
      const validationError = new Error(message);
      validationError.statusCode = 400;
      return next(validationError);
    }

    req[property] = value;
    next();
  };
}
