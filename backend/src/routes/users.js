import { Router } from 'express';
import log from '../logging/service';
import validateMiddleware from '../middlewares/validate';
import { nameConstraints, secondNameConstraints, patronymicConstraints, usernameConstraints, passwordConstraints } from '../validators/constraints';
import { handleErrors } from '../utils/routes';
import models from '../models';

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
  validateMiddleware,
  async (req, res) => {
    try {
      await models.user.create({
        name: req.body.name,
        secondName: req.body.secondName,
        patronymic: req.body.patronymic,
        role: 'patient',
        username: req.body.username,
        password: req.body.password
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

export default router;
