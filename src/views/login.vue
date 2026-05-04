<script setup>
import { ref, reactive } from 'vue'
import { Back } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { login } from '@/apis/admin'
import { ElMessage } from 'element-plus'
const router = useRouter()
const formData=reactive({
  username:'',
  password:''
})
const rules=reactive({
  username:[
    {required:true,message:'请输入用户名',trigger:'blur'}
  ],
  password:[
    {required:true,message:'请输入密码',trigger:'blur'}
  ]
})
const ruleFormRef=ref()
//登录提交
const submitForm=async(formEl)=>{
 if(!formEl) return
 await formEl.validate((valid,fields)=>{
  if(valid){
    login(formData).then(data=>{
      //判断token是否存在
      if(!data.token){
       return ElMessage.error('登录失败')
      }
      //登陆成功
     localStorage.setItem('token',data.token)
     localStorage.setItem('userInfo',JSON.stringify(data.userInfo))
     console.log(data.userInfo)
     if(data.userInfo.userType===2){
      router.push('/back/dashbord')
     }
     if(data.userInfo.userType===1){
      router.push('/')
     }

    })
  }
 })
}

const handleLogin = () => {
  submitForm(ruleFormRef.value)
}
const handleBack = () => {
  router.push('/')
}

</script>

<template>
  <div class="container">
    <div class="title">
      <div class="back-home"@click="handleBack">
        <el-icon ><Back /></el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="rules"
     label-position="top"
      >
      <el-form-item label="用户或邮箱" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名或邮箱"size="large" type="text"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" placeholder="请输入密码" size="large" type="password" show-password></el-input>
      </el-form-item>
        <el-button class="btn" size="large" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
      </el-form>
      <div class="footer">
     <p>还没有账号？<router-link to="/auth/register">去注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 384px;

  .title {
    .back-home {
      display: flex;
      align-items: center;
      margin-bottom: 60px;
      cursor: pointer;
      color: #8e9096;
     .el-icon{
      font-size: 24px;
      margin-right: 10px;
     }
    }
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
  .btn {
    margin-top: 40px;
    width: 100%;
  }

  .footer {
    margin-top: 40px;
    text-align: center;

    p {
      font-size: 18px;
      color: #6b7280;
    }
  }
}
.form-container {
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
