<template>
  <div id="app">
    <div class="container">
      <h1>Short URL Generator</h1>
      <form @submit.prevent="submitForm" class="url-form">
        <div class="form-group">
          <label for="fullUrl">Long URL:</label>
          <input type="url" id="fullUrl" v-model="form.fullUrl" placeholder="https://example.com/very/long/url"
            required />
        </div>

        <div class="form-group">
          <label for="shortCode">Custom Short Code (Optional):</label>
          <input type="text" id="shortCode" v-model="form.shortCode" placeholder="custom-code" pattern="[A-Za-z0-9]+"
            title="Alphanumeric characters only" />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Creating...' : 'Shorten URL' }}
        </button>
      </form>

      <div v-if="result" class="result success">
        <p>Short URL created successfully!</p>
        <a :href="result" target="_blank">{{ result }}</a>
      </div>

      <div v-if="error" class="result error">
        <p>Error: {{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const form = reactive({
  fullUrl: '',
  shortCode: ''
});

const loading = ref(false);
const result = ref(null);
const error = ref(null);

const submitForm = async () => {
  loading.value = true;
  result.value = null;
  error.value = null;

  try {
    const response = await fetch('/api/v1/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullUrl: form.fullUrl,
        shortCode: form.shortCode || undefined
      })
    });

    const responseData = await response.json();

    if (!responseData.success) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    const { shortCode } = responseData.data;
    if (shortCode) {
      result.value = `${window.location.origin}/${shortCode}`;
    } else {
      result.value = JSON.stringify(responseData.data);
    }

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.url-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3aa876;
}

button:disabled {
  background-color: #a8d8c4;
  cursor: not-allowed;
}

.result {
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
}

.success {
  background-color: #e8f5e9;
  border: 1px solid #c8e6c9;
  color: #2e7d32;
}

.error {
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  color: #c62828;
}
</style>
