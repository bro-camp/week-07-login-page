import express from 'express';
import { viewsDirPath } from '#global/paths';

const router = express.Router();

router.get('/', (req, res) => {
  const authStatus = req.session.isAuth ? 'authorized' : 'unauthorized';

  res.render(`${viewsDirPath}/pages/home`, {
    authStatus,
    username: req.session.username,
    displayName: req.session.displayName,
    email: req.session.email,
  });
});

export default router;
