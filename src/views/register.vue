<script setup>
import { ref } from 'vue'
import { register } from '@/apis/fronted'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const formData = ref({
  "username": "",
  "email": "",
  "nickname": "",
  "phone": "",
  "password": "",
  "confirmPassword": "",
  "gender": 0,
  "userType": 1
})

const rules = ref({
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  userType: [
    { required: true, message: '请选择用户类型', trigger: 'change' }
  ]
})

const formRef = ref(null)
const submitForm = async () => {
  if (!formRef.value) {
    return
  }
  formRef.value.validate(async (valid)=>{
    if (!valid) {
      return
    }
    if(formData.value.password !== formData.value.confirmPassword) {
      ElMessage.error('两次密码不一致')
      return
    }
    const res = await register(formData.value)
    if(res.code ==='BUSINESS_ERROR' || res.code ==='-1') {
      ElMessage.error(res.msg || '注册失败')
      return
    }
    else {
      ElMessage.success('注册成功')
      router.push('/auth/login')
    }
  })
}
</script>


<template>
  <div class="container">
    <div class="title">
      <div class="title-text">
        <h2>创建您的账户</h2>
        <p>请填写注册信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form :model="formData" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" size="large" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" size="large" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入昵称(可选)" size="large" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号(可选)" size="large" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" size="large" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" placeholder="请再次输入密码" size="large" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" @click="submitForm" class="btn">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 384px;

  .flex-box {
    display: flex;
    align-items: center;
  }

  .title {
    .title-text {
      text-align: center;

      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }

      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }

  .form-container {
    margin-top: 30px;

    .btn {
      margin-top: 40px;
      width: 100%;
    }

    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>