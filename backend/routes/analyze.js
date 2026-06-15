const express = require('express');
const router = express.Router();
const { analyzeQuestion } = require('../services/deepseek');

router.post('/analyze', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'question参数不能为空'
      });
    }

    const result = await analyzeQuestion(question.trim());
    
    res.json({
      knowledge: result.knowledge || '',
      reason: result.reason || '',
      solution: result.solution || '',
      exercise: result.exercise || '',
      suggestion: result.suggestion || ''
    });
    
  } catch (error) {
    console.error('分析题目时发生错误:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: '分析题目时发生错误，请稍后重试'
    });
  }
});

module.exports = router;
