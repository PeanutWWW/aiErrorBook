require('dotenv').config();
const express = require('express');
const cors = require('cors');

const analyzeRouter = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', analyzeRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'AI错题诊断助手 API',
    endpoints: {
      analyze: 'POST /api/analyze'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log('  POST /api/analyze - 分析题目');
});
