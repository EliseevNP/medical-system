import { Router } from 'express';
import { handleErrors } from '../utils/routes';
import { doctorIdConstraints, eventIdConstraints, optionalStatusConstraints } from '../validators/constraints';
import ControlledError from '../utils/controlledError';
import errors from '../../config/errors';
import log from '../logging/service';
import models from '../models';
import validationMiddleware from '../middlewares/validate';
import authenticationMiddleware from '../middlewares/authenticate';
import validate from 'validate.js';

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
      (await models.event.findAll({ where: { doctorId: req.query.doctorId }})).forEach((event) => {
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
      let updatedEvent = await models.event.findOne({ where: { id: req.params.id }});
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
          if (req.user.role === 'doctor' && (await req.user.getDoctor()).id !== updatedEvent.doctorId) {
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
        status: updatedEvent.status,
        date: updatedEvent.date,
        userId: updatedEvent.userId,
        doctorId: updatedEvent.doctorId
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
