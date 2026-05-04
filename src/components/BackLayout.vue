<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'

</script>



 <template>
  <div class="back-layout">
    <el-container class="side-container">
      <Sidebar></Sidebar>
      <el-container>
        <el-header>
          <Navbar></Navbar>
        </el-header>
        <el-main class="main-container">
          <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>




<style lang="scss" scoped>
 .back-layout {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  .side-container {
    height: 100%;
  }
  .el-header {
    height: 74px!important;
  }
  :deep(.el-main) {
    overflow-y: auto;
  }
  .content-container {
    padding: 20px;
    background-color: #fff;
    min-height: calc(100% - 74px);
  }

 }
  

</style>
