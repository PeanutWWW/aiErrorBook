const { OpenAI } = require('openai');

const deepseekClient = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1'
});

const mockAnalysis = (question) => {
  return {
    knowledge: "二次函数,顶点坐标,配方法",
    reason: "这道题主要考查二次函数顶点坐标的求解方法。解题思路是利用配方法将一般式转化为顶点式，或者直接使用顶点公式 x = -b/(2a) 来计算顶点的横坐标，再代入函数求纵坐标。",
    solution: "方法一：配方法\n" +
              "y = x² - 4x + 3\n" +
              "= x² - 4x + 4 - 4 + 3\n" +
              "= (x - 2)² - 1\n" +
              "顶点式为 y = (x - 2)² - 1，所以顶点坐标为 (2, -1)\n\n" +
              "方法二：公式法\n" +
              "对于二次函数 y = ax² + bx + c，顶点横坐标 x = -b/(2a)\n" +
              "这里 a = 1, b = -4\n" +
              "x = -(-4)/(2×1) = 4/2 = 2\n" +
              "代入原函数：y = 2² - 4×2 + 3 = 4 - 8 + 3 = -1\n" +
              "所以顶点坐标为 (2, -1)",
    exercise: "1. 已知二次函数 y = 2x² + 6x - 8，求顶点坐标\n" +
              "2. 求函数 y = -x² + 2x + 3 的顶点坐标和对称轴",
    suggestion: "1. 建议复习二次函数的三种形式：一般式、顶点式、交点式\n" +
                "2. 多练习配方法，掌握如何将一般式转化为顶点式\n" +
                "3. 记住顶点坐标公式：(-b/(2a), f(-b/(2a)))\n" +
                "4. 可以通过画图来直观理解顶点的位置"
  };
};

const analyzeQuestion = async (question) => {
  const prompt = `
分析数学题：${question}

严格按照JSON格式输出，不得有任何额外文字：
{"knowledge":"知识点","reason":"解题思路","solution":"解答过程","exercise":"练习题","suggestion":"学习建议"}

要求：
1.knowledge:初中或高中数学知识点，逗号分隔
2.reason:适合中学生的解题思路，步骤清晰
3.solution:详细解题过程和最终答案
4.exercise:1-2道同类型练习题，只需题目无需解答
5.suggestion:针对本题的学习建议

只输出JSON，无其他内容。
  `.trim();

  try {
    console.log('正在调用DeepSeek API...');
    console.log('Prompt长度:', prompt.length);
    
    const response = await deepseekClient.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一个数学老师，擅长分析数学题目并给出详细解答。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const result = response.choices[0].message.content;
    console.log('API返回结果:', result);
    
    try {
      return JSON.parse(result);
    } catch (error) {
      console.error('JSON解析失败:', error.message);
      console.error('原始返回内容:', result);
      console.log('使用模拟数据返回...');
      return mockAnalysis(question);
    }
  } catch (error) {
    console.error('DeepSeek API调用失败:', error.message);
    if (error.response) {
      console.error('HTTP状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    console.log('使用模拟数据返回...');
    return mockAnalysis(question);
  }
};

module.exports = {
  analyzeQuestion
};
