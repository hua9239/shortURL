<template>
  <div class="login-container">
    <div class="card">
      <div class="card-header">
        <h2>Login</h2>
      </div>
      <form @submit.prevent="handleLogin" class="form">
        <div class="form-group">
          <label>Username</label>
          <div class="input-group">
            <span class="input-prefix"><i class="fas fa-user"></i></span>
            <input v-model="form.username" placeholder="Username" required autocomplete="username" />
          </div>
        </div>
        <div class="form-group">
          <label>Password</label>
          <div class="input-group">
            <span class="input-prefix"><i class="fas fa-lock"></i></span>
            <input v-model="form.password" type="password" placeholder="Password" required autocomplete="current-password" />
          </div>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            <i class="fas fa-sign-in-alt" style="margin-right: 5px"></i>
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  username: '',
  password: ''
})
const loading = ref(false)

const handleLogin = async () => {
  if (!form.username || !form.password) {
    alert('Please enter username and password')
    return
  }

  loading.value = true
  try {
    const response = await axios.post('/api/v1/login', form)
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token)
      router.push('/manage')
    }
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.message || 'Login failed')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  padding-top: 100px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 400px;
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

.btn-block {
  width: 100%;
  box-sizing: border-box;
}
</style>