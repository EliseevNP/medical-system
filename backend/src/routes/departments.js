import { Router } from 'express';
import { handleErrors } from '../utils/routes';
import { optionalOrganizationIdConstraints } from '../validators/constraints';
import log from '../logging/service';
import models from '../models';
import validationMiddleware from '../middlewares/validate';

const router = Router();

router.get('/',
  (req, res, next) => {
    req.queryConstraints = {
      organizationId: optionalOrganizationIdConstraints
    };
    next();
  },
  validationMiddleware,
  async (req, res) => {
    try {
      let result = {};
      let where = (req.query.organizationId) ? { organizationId: req.query.organizationId } : {};
      (await models.department.findAll({ where })).forEach((department) => {
        result[department.id] = {
          organizationId: department.organizationId,
          title: department.title,
          address: department.address,
          phone: department.phone
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

export default router;
