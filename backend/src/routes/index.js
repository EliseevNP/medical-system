import { Router } from 'express';
import api from './api';
import users from './users';

const router = Router();

router.use(`/`, api);
router.use(`/v1/users/`, users);

export default router;
