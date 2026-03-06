var express = require('express');
var router = express.Router();
let roleSchema = require('../schemas/roles')

// GET all roles (not deleted)
// /api/v1/roles
router.get('/', async function (req, res, next) {
  try {
    let data = await roleSchema.find({ isDeleted: false });
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
});

// GET role by id
// /api/v1/roles/:id
router.get('/:id', async function (req, res, next) {
  try {
    let result = await roleSchema.findOne({
      _id: req.params.id,
      isDeleted: false
    });
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

// POST create new role
// /api/v1/roles
router.post('/', async function (req, res, next) {
  try {
    let newObj = new roleSchema({
      name: req.body.name,
      description: req.body.description
    });
    await newObj.save();
    res.status(201).send(newObj);
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// PUT update role
// /api/v1/roles/:id
router.put('/:id', async function (req, res, next) {
  try {
    let result = await roleSchema.findOne({
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
      res.status(200).send(result);
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

// DELETE soft delete role
// /api/v1/roles/:id
router.delete('/:id', async function (req, res, next) {
  try {
    let result = await roleSchema.findByIdAndUpdate(
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

