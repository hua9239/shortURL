<template>
  <div class="manage-container">
    <div class="card">
      <div class="card-header">
        <h2>Manage URLs</h2>
        <button class="btn btn-primary" @click="fetchUrls">
          <i class="fas fa-sync-alt" style="margin-right: 5px"></i> Refresh
        </button>
      </div>
      
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Short Code</th>
              <th>Full URL</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="4" class="text-center">Loading...</td>
            </tr>
            <tr v-else-if="urls.length === 0">
              <td colspan="4" class="text-center">No URLs found</td>
            </tr>
            <tr v-else v-for="url in urls" :key="url.shortCode">
              <td>
                <a :href="getShortUrl(url.shortCode)" target="_blank" class="link">
                  <i class="fas fa-external-link-alt" style="margin-right: 5px"></i> {{ url.shortCode }}
                </a>
              </td>
              <td>
                <div class="text-truncate" :title="url.fullUrl">{{ url.fullUrl }}</div>
              </td>
              <td>{{ formatDate(url.createdAt) }}</td>
              <td>
                <button class="btn btn-primary btn-sm" style="margin-right: 5px" @click="openEditModal(url)">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" @click="confirmDelete(url.shortCode)">
                  <i class="fas fa-trash-alt"></i> Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Edit URL</h3>
          <button class="close-btn" @click="closeEditModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Short Code</label>
            <input v-model="editForm.shortCode" type="text" class="form-control" placeholder="Short Code">
          </div>
          <div class="form-group">
            <label>Full URL</label>
            <input v-model="editForm.fullUrl" type="text" class="form-control" placeholder="Full URL">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeEditModal">Cancel</button>
          <button class="btn btn-primary" @click="updateUrl" :disabled="updating">
            {{ updating ? 'Updating...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const urls = ref([])
const loading = ref(false)
const showEditModal = ref(false)
const updating = ref(false)
const editForm = ref({
  id: null,
  shortCode: '',
  fullUrl: ''
})

const fetchUrls = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('/api/v1/urls', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data.success) {
      urls.value = response.data.data
    }
  } catch (err) {
    console.error(err)
    alert('Failed to fetch URLs')
  } finally {
    loading.value = false
  }
}

const confirmDelete = (shortCode) => {
  if (confirm('Are you sure to delete this?')) {
    deleteUrl(shortCode)
  }
}

const deleteUrl = async (shortCode) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.delete(`/api/v1/urls/${shortCode}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data.success) {
      fetchUrls()
    }
  } catch (err) {
    console.error(err)
    alert('Failed to delete')
  }
}

const openEditModal = (url) => {
  editForm.value = {
    id: url.id,
    shortCode: url.shortCode,
    fullUrl: url.fullUrl
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = { id: null, shortCode: '', fullUrl: '' }
}

const updateUrl = async () => {
  if (!editForm.value.shortCode || !editForm.value.fullUrl) {
    alert('Please fill all fields')
    return
  }
  
  updating.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.put(`/api/v1/urls/${editForm.value.id}`, {
      shortCode: editForm.value.shortCode,
      fullUrl: editForm.value.fullUrl
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (response.data.success) {
      alert('Updated successfully')
      closeEditModal()
      fetchUrls()
    }
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.message || 'Failed to update')
  } finally {
    updating.value = false
  }
}

const getShortUrl = (code) => {
  return `${window.location.origin}/${code}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString()
}

onMounted(() => {
  fetchUrls()
})
</script>

<style scoped>
.manage-container {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 1000px;
  max-width: 100%;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  color: #606266;
}

.table th, .table td {
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
  text-align: left;
}

.table th {
  color: #909399;
  font-weight: 500;
}

.text-center {
  text-align: center;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.link {
  color: #409eff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
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

.btn-danger {
  background-color: #f56c6c;
  color: #fff;
}

.btn-danger:hover {
  background-color: #f78989;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
}

.btn-secondary {
  background-color: #909399;
  color: #fff;
  margin-right: 10px;
}

.btn-secondary:hover {
  background-color: #a6a9ad;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #303133;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #909399;
}

.close-btn:hover {
  color: #606266;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #ebeef5;
  text-align: right;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #606266;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box; /* Fix input width overflow */
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #409eff;
  outline: none;
}
</style>