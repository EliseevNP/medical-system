import { Router } from 'express';
import api from './api';
import departments from './departments';
import organizations from './organizations';
import users from './users';

const router = Router();

router.use(`/`, api);
router.use(`/v1/users/`, users);
router.use(`/v1/organizations/`, organizations);
router.use(`/v1/departments/`, departments);

export default router;
