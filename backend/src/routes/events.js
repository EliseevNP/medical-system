import { Router } from 'express';
import { doctorIdConstraints, eventIdConstraints, optionalStatusConstraints } from '../validators/constraints';
import { handleErrors } from '../utils/routes';
import ControlledError from '../utils/controlledError';
import authenticationMiddleware from '../middlewares/authenticate';
import errors from '../../config/errors';
import log from '../logging/service';
import models from '../models';
import validate from 'validate.js';
import validationMiddleware from '../middlewares/validate';

const router = Router();

router.get('/',
  (req, res, next) => {
    req.queryConstraints = {
      doctorId: doctorIdConstraints
    };
    next();
  },
  validationMiddleware,
  async (req, res) => {
    try {
      let result = {};
      (await models.event.findAll({
        where: {
          doctorId: req.query.doctorId,
          date: {
            [models.Sequelize.Op.gte]: Date.now()
          }
        }})).forEach((event) => {
        result[event.id] = {
          status: event.status,
          date: event.date,
          userId: event.userId,
          doctorId: event.doctorId
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

router.patch('/:id',
  authenticationMiddleware,
  (req, res, next) => {
    req.paramsConstraints = {
      id: eventIdConstraints
    };
    req.bodyConstraints = {
      status: optionalStatusConstraints
    };
    next();
  },
  validationMiddleware,
  async (req, res) => {
    try {
      let updatedEvent = await models.event.findOne({
        where: {
          id: req.params.id,
          date: {
            [models.Sequelize.Op.gte]: Date.now()
          }
        }});
      if (!updatedEvent) {
        throw new ControlledError(errors.EVENT_NOT_FOUND, log.getLogLevels().WARNING);
      }

      let newEvent = {};
      if (req.body.status && updatedEvent.status !== req.body.status) {
        if (req.body.status === 'busy') {
          if (updatedEvent.status !== 'free') {
            // Если это время не свободно
            throw new ControlledError(errors.EVENT_STATUS_NOT_FREE, log.getLogLevels().WARNING);
          }
          if (req.user.role === 'doctor' && (await req.user.getDoctor()).id === updatedEvent.doctorId) {
            // Если доктор пытается записаться к самому себе
            throw new ControlledError(errors.CANT_TAKE_OWN_EVENT, log.getLogLevels().WARNING);
          }
          newEvent.userId = req.user.id;
        } else if (req.body.status === 'free') {
          if (req.user.role === 'doctor' && (await req.user.getDoctor()).id !== updatedEvent.doctorId && req.user.id !== updatedEvent.userId) {
            // Если запрос сделал доктор, но событие ему не принадлежит
            throw new ControlledError(errors.PERMISSION_ERROR, log.getLogLevels().WARNING);
          }
          if (req.user.role === 'patient' && req.user.id !== updatedEvent.userId) {
            // Если запрос сделал пациент, но событие с ним не связано
            throw new ControlledError(errors.PERMISSION_ERROR, log.getLogLevels().WARNING);
          }
          newEvent.userId = null;
        } else {
          if (req.user.role !== 'doctor' || (await req.user.getDoctor()).id !== updatedEvent.doctorId) {
            // Если запрос сделал не доктор или событие ему не принадлежит
            throw new ControlledError(errors.PERMISSION_ERROR, log.getLogLevels().WARNING);
          }
          newEvent.userId = null;
        }
        newEvent.status = req.body.status;
      }
      if (validate.isEmpty(newEvent)) {
        throw new ControlledError(errors.NOTHING_CHANGED, log.getLogLevels().WARNING);
      }

      await models.event.update(newEvent, { where: { id: req.params.id }});
      await updatedEvent.reload();
      res.json({
        [updatedEvent.id]: {
          status: updatedEvent.status,
          date: updatedEvent.date,
          userId: updatedEvent.userId,
          doctorId: updatedEvent.doctorId
        }
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
