import { Router } from 'express';
import { handleErrors } from '../utils/routes';
import { optionalOrganizationIdConstraints, optionalSpecialtyConstraints, doctorIdConstraints } from '../validators/constraints';
import ControlledError from '../utils/controlledError';
import errors from '../../config/errors';
import log from '../logging/service';
import models from '../models';
import validationMiddleware from '../middlewares/validate';

const router = Router();

router.get('/',
  (req, res, next) => {
    req.queryConstraints = {
      organizationId: optionalOrganizationIdConstraints,
      specialty: optionalSpecialtyConstraints
    };
    next();
  },
  validationMiddleware,
  async (req, res) => {
    try {
      let result = {};

      let where = {};
      if (req.query.organizationId) where.organizationId = req.query.organizationId;
      if (req.query.specialty) where.specialty = req.query.specialty;

      (await models.doctor.findAll({ where, include: [models.user] })).forEach(async (doctor) => {
        result[doctor.id] = {
          name: doctor.user.name,
          secondName: doctor.user.secondName,
          patronymic: doctor.user.patronymic,
          organizationId: doctor.organizationId,
          departmentId: doctor.departmentId,
          specialty: doctor.specialty,
          category: doctor.category,
          position: doctor.position
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

router.get('/specialties',
  async (req, res) => {
    try {
      let specialties = (await models.doctor.aggregate('specialty', 'DISTINCT', { plain: false })).map((specialty) => {
        return specialty.DISTINCT;
      });

      res.json(specialties);
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

router.get('/:id',
  (req, res, next) => {
    req.paramsConstraints = {
      id: doctorIdConstraints
    };
    next();
  },
  validationMiddleware,
  async (req, res) => {
    try {
      let result = {};
      let doctor = await models.doctor.findOne({ where: { id: req.params.id }, include: [models.user] });
      if (!doctor) {
        throw new ControlledError(errors.DOCTOR_NOT_FOUND, log.getLogLevels().WARNING);
      }
      result[doctor.id] = {
        name: doctor.user.name,
        secondName: doctor.user.secondName,
        patronymic: doctor.user.patronymic,
        organizationId: doctor.organizationId,
        departmentId: doctor.departmentId,
        specialty: doctor.specialty,
        category: doctor.category,
        position: doctor.position
      };
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

export default router;
