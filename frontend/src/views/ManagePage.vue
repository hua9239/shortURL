<template>
  <div class="manage">
    <h1>URL Management</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Short Code</th>
          <th>Full URL</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="url in urls" :key="url.id">
          <td>{{ url.id }}</td>
          <td><a :href="getShortUrl(url.shortCode)" target="_blank">{{ url.shortCode }}</a></td>
          <td class="full-url" :title="url.fullUrl">{{ url.fullUrl }}</td>
          <td>
            <button @click="deleteUrl(url.shortCode)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ManagePage',
  data() {
    return {
      urls: [],
      loading: true,
      error: null
    }
  },
  mounted() {
    this.fetchUrls();
  },
  methods: {
    async fetchUrls() {
      try {
        const response = await fetch('/api/v1/urls');
        if (!response.ok) {
          throw new Error('Failed to fetch URLs');
        }
        const data = await response.json();
        if (data.success) {
          this.urls = data.data;
        } else {
          this.error = data.message || 'Unknown error';
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteUrl(shortCode) {
      if (!confirm(`Are you sure you want to delete ${shortCode}?`)) return;
      
      try {
        const response = await fetch(`/api/v1/urls/${shortCode}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.success) {
          this.urls = this.urls.filter(u => u.shortCode !== shortCode);
        } else {
          alert(data.message || 'Failed to delete');
        }
      } catch (err) {
        alert('Error deleting URL');
      }
    },
    getShortUrl(code) {
      return `${window.location.origin}/${code}`;
    }
  }
}
</script>

<style scoped>
.manage {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
.full-url {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.error {
  color: red;
}
button {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
button:hover {
  background-color: #cc0000;
}
</style>
