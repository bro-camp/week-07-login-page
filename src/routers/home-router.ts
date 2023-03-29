import express from 'express';
import { viewsDirPath } from '#global/paths';

const router = express.Router();

router.get('/', (req, res) => {
  const authStatus = req.session.isAuth ? 'authorized' : 'unauthorized';

  res.render(`${viewsDirPath}/pages/home`, {
    authStatus,
  });
});

export default router;
