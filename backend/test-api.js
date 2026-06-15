require('dotenv').config();
const { OpenAI } = require('openai');

console.log('API Key:', process.env.DEEPSEEK_API_KEY ? '已配置' : '未配置');

const deepseekClient = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1'
});

async function test() {
  try {
    console.log('正在测试DeepSeek API...');
    const response = await deepseekClient.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: '你好' }
      ],
      max_tokens: 100
    });
    console.log('API调用成功:', response.choices[0].message.content);
  } catch (error) {
    console.error('API调用失败:', error.message);
    if (error.response) {
      console.error('HTTP状态码:', error.response.status);
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('请求已发送但无响应');
    } else {
      console.error('请求配置错误:', error.message);
    }
  }
}

test();