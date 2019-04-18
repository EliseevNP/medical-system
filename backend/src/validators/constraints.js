import errors from '../../config/errors';
import validate from 'validate.js';

validate.validators.isString = function(value, options) {
  if (value === undefined || value === null) {
    return;
  }
  if (!validate.isString(value)) {
    return options.message;
  }
  return;
};

// Errors: [1, 2]
export const nameConstraints = {
  presence: {
    is: true,
    allowEmpty: false,
    message: errors.BLANK_NAME
  },
  length: {
    minimum: 3,
    maximum: 20,
    message: errors.INVALID_NAME_LENGTH,
  },
  isString: {
    message: errors.NAME_IS_NOT_A_STRING
  }
};

export const secondNameConstraints = {
  presence: {
    is: true,
    allowEmpty: false,
    message: errors.BLANK_SECOND_NAME
  },
  length: {
    minimum: 3,
    maximum: 20,
    message: errors.INVALID_SECOND_NAME_LENGTH,
  },
  isString: {
    message: errors.SECOND_NAME_IS_NOT_A_STRING
  }
}
export const patronymicConstraints = {
  presence: {
    is: true,
    allowEmpty: false,
    message: errors.BLANK_PATRONYMIC
  },
  length: {
    minimum: 3,
    maximum: 20,
    message: errors.INVALID_PATRONYMIC_LENGTH,
  },
  isString: {
    message: errors.PATRONYMIC_IS_NOT_A_STRING
  }
}
export const usernameConstraints = {
  presence: {
    is: true,
    allowEmpty: false,
    message: errors.BLANK_USERNAME
  },
  length: {
    minimum: 3,
    maximum: 20,
    message: errors.INVALID_USERNAME_LENGTH,
  },
  isString: {
    message: errors.USERNAME_IS_NOT_A_STRING
  }
}
export const passwordConstraints = {
  presence: {
    is: true,
    allowEmpty: false,
    message: errors.BLANK_PASSWORD
  },
  length: {
    minimum: 3,
    maximum: 20,
    message: errors.INVALID_PASSWORD_LENGTH,
  },
  isString: {
    message: errors.PASSWORD_IS_NOT_A_STRING
  }
}