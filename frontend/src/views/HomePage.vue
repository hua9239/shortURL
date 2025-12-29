<template>
  <div class="home">
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
    const response = await fetch('/api/v1/urls', {
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

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.url-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  background-color: #a0dca0;
  cursor: not-allowed;
}

.result {
  margin-top: 20px;
  padding: 15px;
  border-radius: 4px;
}

.success {
  background-color: #dff0d8;
  color: #3c763d;
}

.error {
  background-color: #f2dede;
  color: #a94442;
}
</style>
