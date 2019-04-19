import errors from '../../config/errors';
import uuidv4 from 'uuidv4';
import validate from 'validate.js';

validate.validators.checkIsString = function(value, options) {
  if (value === undefined || value === null) {
    return;
  }
  if (!validate.checkIsString(value)) {
    return options.message;
  }
  return;
};

validate.validators.checkIsUUIDv4 = function(value, options) {
  if (value === undefined) {
    return;
  }
  if (options.allowNull && value === null) {
    return;
  }
  if (!uuidv4.is(value)) {
    return options.message;
  }
  return;
};

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
  checkIsString: {
    message: errors.NAME_IS_NOT_A_STRING
  }
};
export const optionalNameConstraints = {
  length: {
    minimum: 3,
    maximum: 20,
    message: errors.INVALID_NAME_LENGTH,
  },
  checkIsString: {
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
  checkIsString: {
    message: errors.SECOND_NAME_IS_NOT_A_STRING
  }
};
export const optionalSecondNameConstraints = {
  length: {
    minimum: 3,
    maximum: 20,
    message: errors.INVALID_SECOND_NAME_LENGTH,
  },
  checkIsString: {
    message: errors.SECOND_NAME_IS_NOT_A_STRING
  }
};

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
  checkIsString: {
    message: errors.PATRONYMIC_IS_NOT_A_STRING
  }
};
export const optionalPatronymicConstraints = {
  length: {
    minimum: 3,
    maximum: 20,
    message: errors.INVALID_PATRONYMIC_LENGTH,
  },
  checkIsString: {
    message: errors.PATRONYMIC_IS_NOT_A_STRING
  }
};

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
  checkIsString: {
    message: errors.USERNAME_IS_NOT_A_STRING
  }
};
export const optionalUsernameConstraints = {
  length: {
    minimum: 3,
    maximum: 20,
    message: errors.INVALID_USERNAME_LENGTH,
  },
  checkIsString: {
    message: errors.USERNAME_IS_NOT_A_STRING
  }
};

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
  checkIsString: {
    message: errors.PASSWORD_IS_NOT_A_STRING
  }
};
export const optionalPasswordConstraints = {
  length: {
    minimum: 3,
    maximum: 20,
    message: errors.INVALID_PASSWORD_LENGTH,
  },
  checkIsString: {
    message: errors.PASSWORD_IS_NOT_A_STRING
  }
};

export const organizationIdConstraints = {
  presence: {
    is: true,
    message: errors.BLANK_ORGANIZATION_ID
  },
  checkIsUUIDv4: {
    message: errors.INVALID_ORGANIZATION_ID,
    allowNull: false
  }
};