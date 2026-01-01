<template>
  <div class="home-container">
    <div class="card">
      <div class="card-header">
        <h2>Short URL Generator</h2>
      </div>
      <form @submit.prevent="submitForm" class="form">
        <div class="form-group">
          <label>Long URL</label>
          <div class="input-group">
            <span class="input-prefix"><i class="fas fa-link"></i></span>
            <input v-model="form.fullUrl" placeholder="https://example.com/very/long/url" type="url" required />
          </div>
        </div>
        <div class="form-group">
          <label>Custom Code</label>
          <div class="input-group">
            <span class="input-prefix"><i class="fas fa-tag"></i></span>
            <input v-model="form.shortCode" placeholder="Optional custom code" />
          </div>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <i class="fas fa-compress-arrows-alt" style="margin-right: 5px"></i>
            {{ loading ? 'Shortening...' : 'Shorten URL' }}
          </button>
        </div>
      </form>

      <div v-if="result" class="alert alert-success">
        <div class="alert-icon"><i class="fas fa-check-circle"></i></div>
        <div class="alert-content">
          <span>Your short URL: </span>
          <a :href="result" target="_blank" class="link">{{ result }}</a>
          <button class="btn btn-sm" @click="copyToClipboard">
            <i class="fas fa-copy" style="margin-right: 5px"></i> Copy
          </button>
        </div>
      </div>

      <div v-if="error" class="alert alert-error">
        <div class="alert-icon"><i class="fas fa-exclamation-circle"></i></div>
        <div class="alert-content">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'

const form = reactive({
  fullUrl: '',
  shortCode: ''
})

const loading = ref(false)
const result = ref('')
const error = ref('')

const submitForm = async () => {
  if (!form.fullUrl) {
    alert('Please enter a URL')
    return
  }

  loading.value = true
  result.value = ''
  error.value = ''

  try {
    const response = await axios.post('/api/v1/urls', form)
    if (response.data.success) {
      const shortCode = response.data.data.shortCode
      result.value = `${window.location.origin}/${shortCode}`
    }
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(result.value)
    alert('Copied to clipboard')
  } catch (err) {
    alert('Failed to copy')
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  padding-top: 50px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 600px;
  max-width: 90%;
  padding: 20px;
}

.card-header {
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
  font-weight: 500;
}

.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.input-group:focus-within {
  border-color: #409eff;
}

.input-prefix {
  padding: 0 10px;
  color: #909399;
  background: #f5f7fa;
  border-right: 1px solid #dcdfe6;
  height: 40px;
  display: flex;
  align-items: center;
}

input {
  flex: 1;
  border: none;
  height: 38px;
  padding: 0 10px;
  outline: none;
  color: #606266;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #409eff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #66b1ff;
}

.btn-primary:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.btn-sm:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.alert {
  padding: 10px 15px;
  border-radius: 4px;
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.alert-success {
  background-color: #f0f9eb;
  color: #67c23a;
}

.alert-error {
  background-color: #fef0f0;
  color: #f56c6c;
}

.alert-icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

.alert-content {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.link {
  color: #409eff;
  text-decoration: none;
  margin: 0 10px;
}

.link:hover {
  text-decoration: underline;
}
</style>
