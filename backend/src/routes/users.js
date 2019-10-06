import { Router } from 'express';
import { handleErrors } from '../utils/routes';
import { nameConstraints, optionalNameConstraints, optionalPasswordConstraints, optionalPatronymicConstraints, optionalSecondNameConstraints, optionalUserIdsConstraints, optionalUsernameConstraints, passwordConstraints, patronymicConstraints, secondNameConstraints, usernameConstraints } from '../validators/constraints';
import ControlledError from '../utils/controlledError';
import authenticationMiddleware from '../middlewares/authenticate';
import errors from '../../config/errors';
import log from '../logging/service';
import models from '../models';
import uuidv4 from 'uuidv4';
import validate from 'validate.js';
import validationMiddleware from '../middlewares/validate';

const router = Router();

router.post('/signup',
  (req, res, next) => {
    req.bodyConstraints = {
      name: nameConstraints,
      secondName: secondNameConstraints,
      patronymic: patronymicConstraints,
      username: usernameConstraints,
      password: passwordConstraints
    };
    next();
  },
  validationMiddleware,
  async (req, res) => {
    try {
      await models.sequelize.transaction(async (transaction) => {
        let isUsernamAlreadyInUse = await models.user.findOne({
          where: { username: req.body.username },
          transaction
        });
        if (isUsernamAlreadyInUse) {
          throw new ControlledError(errors.USERNAME_ALREADY_IN_USE, log.getLogLevels().WARNING);
        }
        await models.user.create({
          name: req.body.name,
          secondName: req.body.secondName,
          patronymic: req.body.patronymic,
          role: 'patient',
          username: req.body.username,
          password: req.body.password
        }, { transaction });
      });

      res.sendStatus(200);
      log.trace('SERVER', {}, req, res);
    } catch (err) {
      if (err.name === 'ControlledError') {
        handleErrors('SERVER', [err], res, 400);
      } else {
        handleErrors('SERVER', [err], res, 500);
      }
    }
  }
);

router.post('/signin',
  (req, res, next) => {
    req.bodyConstraints = {
      username: usernameConstraints,
      password: passwordConstraints
    };
    next();
  },
  validationMiddleware,
  async (req, res) => {
    try {
      let authorization;
      await models.sequelize.transaction(async (transaction) => {
        let user = await models.user.findOne({
          where: {
            username: req.body.username,
            password: req.body.password
          },
          transaction
        });
        if (!user) {
          throw new ControlledError(errors.USERNAME_OR_PASSWORD_IS_INCORRECT, log.getLogLevels().WARNING);
        }
        authorization = await models.authorization.create({ userId: user.id }, { transaction });
      });

      res.cookie('authorization', authorization.id);
      res.sendStatus(200);
      log.trace('SERVER', {}, req, res);
    } catch (err) {
      if (err.name === 'ControlledError') {
        handleErrors('SERVER', [err], res, 400);
      } else {
        handleErrors('SERVER', [err], res, 500);
      }
    }
  }
);

router.post('/signout',
  async (req, res) => {
    try {
      if (uuidv4.is(req.cookies.authorization)) {
        let authorization = await models.authorization.findOne({ where: { id: req.cookies.authorization } });
        if (authorization) {
          await authorization.destroy();
        }
      }
      res.clearCookie('authorization');
      res.sendStatus(200);
      log.trace('SERVER', {}, req, res);
    } catch (err) {
      if (err.name === 'ControlledError') {
        handleErrors('SERVER', [err], res, 400);
      } else {
        handleErrors('SERVER', [err], res, 500);
      }
    }
  }
);

router.get('/',
  (req, res, next) => {
    req.queryConstraints = {
      userIds: optionalUserIdsConstraints
    };
    next();
  },
  validationMiddleware,
  async (req, res) => {
    try {
      let result = {};

      let where = {};
      if (req.query.userIds) where.id = req.query.doctorIds;

      (await models.user.findAll({ where })).forEach(async (user) => {
        result[user.id] = {
          name: user.name,
          secondName: user.secondName,
          patronymic: user.patronymic
        };
      });
      res.json(result);
      res.status(200);
      log.trace('SERVER', {}, req, res);
    } catch (err) {
      if (err.name === 'ControlledError') {
        handleErrors('SERVER', [err], res, 400);
      } else {
        handleErrors('SERVER', [err], res, 500);
      }
    }
  }
);

router.get('/self',
  authenticationMiddleware,
  async (req, res) => {
    try {
      let doctor = await req.user.getDoctor();
      if (doctor) {
        req.user.doctorId = doctor.id;
      }
      res.json({
        id: req.user.id,
        name: req.user.name,
        secondName: req.user.secondName,
        patronymic: req.user.patronymic,
        role: req.user.role,
        username: req.user.username,
        doctorId: req.user.doctorId
      });
      res.status(200);
      log.trace('SERVER', {}, req, res);
    } catch (err) {
      if (err.name === 'ControlledError') {
        handleErrors('SERVER', [err], res, 400);
      } else {
        handleErrors('SERVER', [err], res, 500);
      }
    }
  }
);

router.patch('/self',
  authenticationMiddleware,
  (req, res, next) => {
    req.bodyConstraints = {
      name: optionalNameConstraints,
      secondName: optionalSecondNameConstraints,
      patronymic: optionalPatronymicConstraints,
      username: optionalUsernameConstraints,
      password: optionalPasswordConstraints
    };
    next();
  },
  validationMiddleware,
  async (req, res) => {
    try {
      let newUser = {};
      if (req.body.name && req.user.name !== req.body.name) {
        newUser.name = req.body.name;
      }
      if (req.body.secondName && req.user.secondName !== req.body.secondName) {
        newUser.secondName = req.body.secondName;
      }
      if (req.body.patronymic && req.user.patronymic !== req.body.patronymic) {
        newUser.patronymic = req.body.patronymic;
      }
      if (req.body.username && req.user.username !== req.body.username) {
        if (await models.user.findOne({ where: { username: req.body.username }})) {
          throw new ControlledError(errors.USERNAME_ALREADY_IN_USE, log.getLogLevels().WARNING);
        }
        newUser.username = req.body.username;
      }
      if (req.body.password) {
        newUser.password = req.body.password;
      }
      if (validate.isEmpty(newUser)) {
        throw new ControlledError(errors.NOTHING_CHANGED, log.getLogLevels().WARNING);
      }
      await models.user.update(newUser, { where: { id: req.user.id }});
      await req.user.reload();
      res.json({
        name: req.user.name,
        secondName: req.user.secondName,
        patronymic: req.user.patronymic,
        role: req.user.role,
        username: req.user.username
      });
      res.status(200);
      log.trace('SERVER', {}, req, res);
    } catch (err) {
      if (err.name === 'ControlledError') {
        handleErrors('SERVER', [err], res, 400);
      } else {
        handleErrors('SERVER', [err], res, 500);
      }
    }
  }
);

export default router;
