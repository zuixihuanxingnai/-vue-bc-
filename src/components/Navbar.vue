<script setup>
// 导入所有需要的图标
import { ArrowDown, Expand } from '@element-plus/icons-vue'
import avatarImage from '@/assets/images/user.jpg'
import { useRouter,useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { loginout } from '@/apis/admin'
import { ElMessageBox } from 'element-plus'
const router = useRouter()
const route = useRoute()
const adminStore=useAdminStore()
const handleCollapse=()=>{
  adminStore.toggleCollapse()
}
// 退出登录函数
const logout = (command) => {
  console.log('退出参数：', command)
  if (command !== 'logout') {
    return
  }
  ElMessageBox.confirm('确定退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loginout().then(()=>{
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/auth/login').catch(() => {}) // 防止重复跳转报错
    })
  }).catch(() => {
    // 取消退出登录
  })
}
</script>

<template>
  <div class="navbar">
    <div class="flex-box">
      <el-button @click="handleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-title">{{route.meta.title}}</p>
    </div>

    <div class="flex-box" style="margin-right: 20px;">
      <!-- el-dropdown 正确用法：唯一子元素 + 绑定 command -->
      <el-dropdown @command="logout">
        <div class="dropdown-trigger">
          <el-avatar :src="avatarImage" size="small" style="background-size: cover" />
          <span class="user-name">李家满</span>
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #e5e7eb;

  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .page-title {
    margin-left: 20px;
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
  }

  .dropdown-trigger {
    display: flex;
    align-items: center;
    cursor: pointer;

    .user-name {
      margin-left: 8px;
      margin-right: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
  }
}
</style>
