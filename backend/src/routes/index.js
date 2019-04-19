import { Router } from 'express';
import api from './api';
import organizations from './organizations';
import users from './users';

const router = Router();

router.use(`/`, api);
router.use(`/v1/users/`, users);
router.use(`/v1/organizations/`, organizations);

export default router;
