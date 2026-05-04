<script setup>
import { useRouter } from 'vue-router'
import robotIcon from '@/assets/images/机器人.png'
import { useAdminStore } from '@/stores/admin'
import {computed} from 'vue'
const adminStore=useAdminStore()
const handleClick=(path)=>{
  router.push(path)
}
const router=useRouter();
const isCollapse=computed(()=>adminStore.isCollapse)
</script>

<template >
  <el-aside :width="isCollapse ? '64px' : '264px'">
  <el-menu
       class="menu"
       :collapse="isCollapse"
       :collapse-transition="false"
      >   
      <div class="brand">
        <el-image :src="robotIcon" alt="logo" style="width: 50px; height: 50px;margin-right: 30px;"></el-image>
        <div  class="info-card" v-if="!isCollapse">
          <h1 class="brand-title">心理健康助手</h1>
          <p class="brand-subtitle" style="margin-left: 30px;">管理后台</p>
        </div>
      </div> 
        <el-menu-item @click="handleClick(item.path)" v-for="item in router.options.routes[0].children"  :index="item.path" :key="item.path">
          <el-icon><component :is="item.meta.icon.name" /></el-icon>
          <span v-if="!isCollapse">{{item.meta.title}}</span>
        </el-menu-item>  
      </el-menu>
      </el-aside>
</template>

<style lang="scss" scoped>
 .menu{
  height: 100%;
 .sidebar {
  height: 100%;
 }
 .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #e5e7eb;

    .info-card {
        .brand-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #1f2937;
        }

        .brand-subtitle {
            font-size: 14px;
            color: #6b7280;
        }
    }
}
}
</style>
