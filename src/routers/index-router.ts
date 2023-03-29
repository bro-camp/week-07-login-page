import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  res.redirect('/home');
});

export default router;
