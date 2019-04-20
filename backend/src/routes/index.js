import { Router } from 'express';
import api from './api';
import departments from './departments';
import doctors from './doctors';
import organizations from './organizations';
import users from './users';
import events from './events';

const router = Router();

router.use(`/`, api);
router.use(`/v1/users/`, users);
router.use(`/v1/organizations/`, organizations);
router.use(`/v1/departments/`, departments);
router.use(`/v1/doctors/`, doctors);
router.use(`/v1/events/`, events);

export default router;
