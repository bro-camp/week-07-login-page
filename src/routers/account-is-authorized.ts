import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ isAuthorized: !!req.session.isAuth });
});

export default router;
