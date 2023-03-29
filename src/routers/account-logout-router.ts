import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
});

export default router;
