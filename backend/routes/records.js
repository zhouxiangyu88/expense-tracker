const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Record = require('../models/Record');

// 创建新记录
router.post('/', auth, async (req, res) => {
  try {
    const record = new Record({
      ...req.body,
      user: req.userId
    });
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 获取用户记录
router.get('/', auth, async (req, res) => {
  try {
    const records = await Record.find({ user: req.userId })
      .sort('-date')
      .limit(50);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 删除记录
router.delete('/:id', auth, async (req, res) => {
  try {
    const record = await Record.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!record) {
      return res.status(404).json({ message: '记录不存在' });
    }

    res.json({ message: '记录删除成功' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
