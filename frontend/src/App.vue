<template>
  <div class="layout-container">
    <header class="navbar">
      <div class="nav-content">
        <router-link to="/" class="nav-brand">Short URL</router-link>
        <div class="flex-grow"></div>
        <a href="#" @click.prevent="handleLoginClick" class="nav-item">{{ authButtonText }}</a>
      </div>
    </header>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)

const checkLoginStatus = () => {
  isLoggedIn.value = !!localStorage.getItem('token')
}

const authButtonText = computed(() => {
  return route.path === '/manage' ? 'Logout' : 'Login'
})

const handleLoginClick = () => {
  if (route.path === '/manage') {
    localStorage.removeItem('token')
    isLoggedIn.value = false
    router.push('/login')
  } else if (isLoggedIn.value) {
    router.push('/manage')
  } else {
    router.push('/login')
  }
}

watch(route, () => {
  checkLoginStatus()
})

onMounted(() => {
  checkLoginStatus()
})
</script>

<style>
body {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  background-color: #f5f7fa;
}

.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #545c64;
  color: #fff;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
}

.nav-content {
  width: 100%;
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  margin-right: 20px;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  margin-left: 20px;
  font-size: 0.9rem;
  cursor: pointer;
}

.nav-item:hover {
  color: #ffd04b;
}

.flex-grow {
  flex-grow: 1;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}
</style>
