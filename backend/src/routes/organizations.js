import { Router } from 'express';
import { handleErrors } from '../utils/routes';
import { organizationIdConstraints } from '../validators/constraints';
import ControlledError from '../utils/controlledError';
import errors from '../../config/errors';
import log from '../logging/service';
import models from '../models';
import validationMiddleware from '../middlewares/validate';

const router = Router();

router.get('/',
  async (req, res) => {
    try {
      let result = {};
      (await models.organization.findAll()).forEach((organization) => {
        result[organization.id] = {
          title: organization.title,
          address: organization.address
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

router.get('/:id',
  (req, res, next) => {
    req.paramsConstraints = {
      id: organizationIdConstraints,
    };
    next();
  },
  validationMiddleware,
  async (req, res) => {
    try {
      let result = {};
      let organization = await models.organization.findOne({ where: { id: req.params.id }});
      if (!organization) {
        throw new ControlledError(errors.ORGANIZATION_NOT_FOUND, log.getLogLevels().WARNING);
      }
      result[organization.id] = {
        title: organization.title,
        address: organization.address,
        site: organization.site,
        phone: organization.phone
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
