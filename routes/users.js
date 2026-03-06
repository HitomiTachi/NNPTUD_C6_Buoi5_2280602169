var express = require('express');
var router = express.Router();
let userSchema = require('../schemas/users')

// GET all users (not deleted)
// /api/v1/users
router.get('/', async function (req, res, next) {
  try {
    let data = await userSchema.find({ isDeleted: false }).populate({ path: 'role', select: 'name description' });
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
});

// POST enable user
// /api/v1/users/enable
router.post('/enable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).send({
        message: "Email and username are required"
      });
    }
    let result = await userSchema.findOne({
      email: email,
      username: username,
      isDeleted: false
    });
    if (result) {
      result.status = true;
      await result.save();
      let populatedUser = await userSchema.findById(result._id).populate({ path: 'role', select: 'name description' });
      res.status(200).send(populatedUser);
    } else {
      res.status(404).send({
        message: "User not found with provided email and username"
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// POST disable user
// /api/v1/users/disable
router.post('/disable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).send({
        message: "Email and username are required"
      });
    }
    let result = await userSchema.findOne({
      email: email,
      username: username,
      isDeleted: false
    });
    if (result) {
      result.status = false;
      await result.save();
      let populatedUser = await userSchema.findById(result._id).populate({ path: 'role', select: 'name description' });
      res.status(200).send(populatedUser);
    } else {
      res.status(404).send({
        message: "User not found with provided email and username"
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// GET user by id
// /api/v1/users/:id
router.get('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate({ path: 'role', select: 'name description' });
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      });
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
});

// POST create new user
// /api/v1/users
router.post('/', async function (req, res, next) {
  try {
    let newObj = new userSchema({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.role,
      loginCount: req.body.loginCount
    });
    await newObj.save();
    let populatedUser = await userSchema.findById(newObj._id).populate({ path: 'role', select: 'name description' });
    res.status(201).send(populatedUser);
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// PUT update user
// /api/v1/users/:id
router.put('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findOne({
      _id: req.params.id,
      isDeleted: false
    });
    if (result) {
      let keys = Object.keys(req.body);
      for (const key of keys) {
        if (key !== '_id' && key !== 'isDeleted' && key !== 'createdAt' && key !== 'updatedAt') {
          result[key] = req.body[key];
        }
      }
      await result.save();
      let populatedUser = await userSchema.findById(result._id).populate({ path: 'role', select: 'name description' });
      res.status(200).send(populatedUser);
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// DELETE soft delete user
// /api/v1/users/:id
router.delete('/:id', async function (req, res, next) {
  try {
    let result = await userSchema.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      });
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    });
  }
});

module.exports = router;
