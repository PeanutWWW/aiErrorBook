<script setup>
import { ref, reactive } from "vue";
import axios from "axios";
import {
  ElUpload,
  ElInput,
  ElButton,
  ElCard,
  ElTag,
  ElCollapse,
  ElCollapseItem,
  ElAlert,
  ElProgress,
  ElLoading,
} from "element-plus";

const imageUrl = ref("");
const questionText = ref("");
const isAnalyzing = ref(false);
const showResult = ref(false);
const loadingInstance = ref(null);
const analysisError = ref("");

const analysisResult = reactive({
  knowledge: "",
  reason: "",
  solution: "",
  exercise: "",
  suggestion: "",
});

const handleImageUpload = (response) => {
  imageUrl.value = URL.createObjectURL(response.raw);
};

const handleRemove = () => {
  imageUrl.value = "";
};

const startAnalysis = async () => {
  if (!questionText.value && !imageUrl.value) {
    return;
  }

  isAnalyzing.value = true;
  showResult.value = false;
  analysisError.value = "";

  const resultCard = document.querySelector(".result-card-container");
  if (resultCard) {
    loadingInstance.value = ElLoading.service({
      target: resultCard,
      text: "AI正在分析中...",
      background: "rgba(15, 23, 42, 0.8)",
    });
  }

  try {
    const response = await axios.post("http://localhost:3000/api/analyze", {
      question: questionText.value.trim(),
    });

    analysisResult.knowledge = response.data.knowledge || "";
    analysisResult.reason = response.data.reason || "";
    analysisResult.solution = response.data.solution || "";
    analysisResult.exercise = response.data.exercise || "";
    analysisResult.suggestion = response.data.suggestion || "";
  } catch (error) {
    console.error("分析失败:", error);
    analysisError.value =
      error.response?.data?.message || "分析失败，请稍后重试";
  } finally {
    isAnalyzing.value = false;
    showResult.value = true;

    if (loadingInstance.value) {
      loadingInstance.value.close();
      loadingInstance.value = null;
    }
  }
};

const errorLevelColor = {
  简单: "success",
  中等: "warning",
  困难: "danger",
};

const errorTypeColor = {
  概念理解错误: "info",
  计算错误: "warning",
  审题错误: "danger",
  方法选择错误: "primary",
};
</script>

<template>
  <div class="app-container">
    <div class="header">
      <div class="header-content">
        <div class="logo">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 12 15 15 12"></polyline>
            <line x1="12" y1="22" x2="12" y2="15"></line>
          </svg>
        </div>
        <h1>AI错题诊断助手</h1>
        <p class="subtitle">智能分析错题，精准定位问题</p>
      </div>
    </div>

    <div class="main-content">
      <ElCard class="input-card">
        <div class="card-header">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="9" cy="9" r="7"></circle>
            <path d="M21 15v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"></path>
            <polyline points="16 11 12 7 8 11"></polyline>
            <line x1="12" y1="12" x2="12" y2="17"></line>
          </svg>
          <span>上传题目图片</span>
        </div>
        <ElUpload
          class="upload-area"
          action="#"
          :show-file-list="false"
          :before-upload="() => false"
          :on-change="handleImageUpload"
          :on-remove="handleRemove"
        >
          <div v-if="!imageUrl" class="upload-placeholder">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p>点击或拖拽上传图片</p>
            <p class="hint">支持 JPG、PNG 格式</p>
          </div>
          <div v-else class="upload-preview">
            <img :src="imageUrl" alt="题目图片" />
            <div class="remove-btn" @click="handleRemove">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          </div>
        </ElUpload>
      </ElCard>

      <ElCard class="input-card">
        <div class="card-header">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
            ></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>输入题目内容</span>
        </div>
        <ElInput
          v-model="questionText"
          type="textarea"
          :rows="6"
          placeholder="请在此输入题目内容，或上传图片后自动识别..."
          class="question-textarea"
        />
      </ElCard>

      <div class="button-container">
        <ElButton
          type="primary"
          size="large"
          :loading="isAnalyzing"
          :disabled="!questionText && !imageUrl"
          @click="startAnalysis"
          class="analyze-btn"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
            <path
              d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"
            ></path>
            <path d="M16 21h5v-5"></path>
          </svg>
          {{ isAnalyzing ? "分析中..." : "开始分析" }}
        </ElButton>
      </div>

      <div class="result-card-container">
        <ElCard v-if="showResult" class="result-card">
          <div class="result-header">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="16 10 10 16 8 14"></polyline>
            </svg>
            <span>分析结果</span>
          </div>

          <div v-if="analysisError" class="error-section">
            <ElAlert type="error" :description="analysisError" show-icon />
          </div>

          <div class="result-content">
            <div class="result-section">
              <h3>题目内容</h3>
              <p class="question-content">{{ questionText }}</p>
            </div>

            <div class="result-tags">
              <ElTag type="info" class="tag"> 知识点 </ElTag>
            </div>

            <ElCollapse accordion>
              <ElCollapseItem title="知识点" name="1">
                <div class="knowledge-tags">
                  <ElTag
                    v-for="(tag, index) in analysisResult.knowledge
                      .split('，')
                      .filter((t) => t.trim())"
                    :key="index"
                    type="info"
                    class="knowledge-tag"
                  >
                    {{ tag.trim() }}
                  </ElTag>
                </div>
              </ElCollapseItem>
              <ElCollapseItem title="错因分析" name="2">
                <p class="analysis-text">{{ analysisResult.reason }}</p>
              </ElCollapseItem>
              <ElCollapseItem title="解题步骤" name="3">
                <div class="solution-content">
                  {{ analysisResult.solution }}
                </div>
              </ElCollapseItem>
              <ElCollapseItem title="相似题" name="4">
                <div class="similar-questions">
                  <div
                    v-for="(q, index) in analysisResult.exercise
                      .split(/[\n。]/)
                      .filter((q) => q.trim())"
                    :key="index"
                    class="similar-item"
                  >
                    <span class="question-number">{{ index + 1 }}.</span>
                    <span>{{ q.trim() }}</span>
                  </div>
                </div>
              </ElCollapseItem>
              <ElCollapseItem title="学习建议" name="5">
                <p class="suggestion-content">
                  {{ analysisResult.suggestion }}
                </p>
              </ElCollapseItem>
            </ElCollapse>

            <div class="confidence-section">
              <div class="confidence-label">分析置信度</div>
              <ElProgress
                type="circle"
                :percentage="92"
                :size="80"
                stroke-width="6"
              />
            </div>
          </div>
        </ElCard>
      </div>
    </div>

    <div class="footer">
      <p>AI错题诊断助手 - 让学习更高效</p>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  padding-bottom: 60px;
}

.header {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(168, 85, 247, 0.1) 100%
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px 20px;
  text-align: center;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.header .logo {
  color: #818cf8;
  margin-bottom: 12px;
}

.header h1 {
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.header .subtitle {
  color: #94a3b8;
  font-size: 14px;
  margin: 0;
}

.main-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cbd5e1;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 16px;
}

.upload-area {
  width: 100%;
}

.upload-placeholder {
  border: 2px dashed rgba(99, 102, 241, 0.3);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #94a3b8;
}

.upload-placeholder:hover {
  border-color: rgba(99, 102, 241, 0.6);
  background: rgba(99, 102, 241, 0.05);
}

.upload-placeholder svg {
  margin-bottom: 12px;
  color: #6366f1;
}

.upload-placeholder p {
  margin: 0;
  font-size: 14px;
}

.upload-placeholder .hint {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.upload-preview {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.upload-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  color: #fff;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.8);
}

.question-textarea {
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #e2e8f0;
  font-size: 14px;
}

.question-textarea::placeholder {
  color: #64748b;
}

.button-container {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.analyze-btn {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.analyze-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.analyze-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-card {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 24px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6366f1;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-section h3 {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.question-content {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  padding: 12px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 8px;
}

.result-tags {
  display: flex;
  gap: 10px;
}

.tag {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
}

:deep(.el-collapse) {
  border: none;
  background: transparent;
}

:deep(.el-collapse-item__header) {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  padding: 14px 16px;
  margin-bottom: 8px;
}

:deep(.el-collapse-item__header:hover) {
  background: rgba(15, 23, 42, 0.7);
}

:deep(.el-collapse-item__content) {
  padding: 16px;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 0 0 8px 8px;
  color: #94a3b8;
}

.analysis-text {
  margin: 12px 0 0 0;
  line-height: 1.7;
  font-size: 14px;
}

.error-section {
  margin-bottom: 16px;
}

.solution-content {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
}

.suggestion-content {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.7;
}

.knowledge-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.knowledge-tag {
  font-size: 12px;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  font-size: 14px;
}

.suggestions-list li:last-child {
  border-bottom: none;
}

.suggestions-list svg {
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 2px;
}

.similar-questions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.similar-item {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  color: #94a3b8;
  font-size: 14px;
}

.question-number {
  color: #6366f1;
  font-weight: 600;
}

.confidence-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
}

.confidence-label {
  color: #94a3b8;
  font-size: 13px;
  margin-bottom: 12px;
}

:deep(.el-progress__text) {
  color: #818cf8 !important;
  font-weight: 600;
}

.footer {
  text-align: center;
  padding: 20px;
  color: #64748b;
  font-size: 13px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.95);
}

.footer p {
  margin: 0;
}
</style>
