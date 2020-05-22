const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const users = db.get('users');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30),
  password: Joi.string().trim().min(10),
  roles: Joi.array().items(Joi.string().valid('user', 'admin')),
  active: Joi.bool(),
});

router.get('/', async (req, res, next) => {
  try {
    const result = await users.find({}, '-password');
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    const result = schema.validate(req.body);
    if (!result.ok) {
      const query = { _id };
      const user = await users.findOne(query);
      if (user) {
        const updatedUser = req.body;
        if (updatedUser.password) {
          updatedUser.password = bcrypt.hash(updatedUser.password, 12);
        }

        const result = await users.findOneAndUpdate(query, {
          $set: updatedUser,
        });
        delete result.password;
        res.json(result);
      } else {
        next();
      }
    } else {
      res.status(422);
      throw new Error(result.error);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
