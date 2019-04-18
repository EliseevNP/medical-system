import { Router } from 'express';
import log from '../logging/service';

const router = Router();

router.get('/', async (req, res) => {
  res.json({
    data: 'v1'
  });
  log.trace('SERVER', {}, req, res);
});

export default router;
