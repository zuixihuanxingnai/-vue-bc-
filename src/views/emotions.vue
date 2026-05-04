<script setup>
import PageHeade from '@/components/PageHeade.vue'
import TabSearch from '@/components/TabSearch.vue'
import {getEmotionsList,deleteEmotion} from '@/apis/admin'
import {ref,reactive,onMounted} from 'vue'
import {ElMessage,ElMessageBox} from 'element-plus'

//映射
const getEmotionTagType = (emotion) => {
  const emotionTypes = {
    '开心': 'success',
    '平静': 'info',
    '疲惫': 'warning',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning'
  }
  return emotionTypes[emotion] || 'info'
}

const getAiEmotionTagType = (emotion) => {
  const emotionTagMap = {
    '开心': 'success',
    '平静': 'success',
    '兴奋': 'warning',
    '满足': 'success',
    '愤怒': 'danger',
    '悲伤': 'info',
    '焦虑': 'warning',
    '恐惧': 'danger',
    '沮丧': 'info',
    '压力': 'warning'
  }
  return emotionTagMap[emotion] || 'info'
}

const getEmotionScoreColor = (score) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel) => {
  const riskTagMap = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger'
  }
  return riskTagMap[riskLevel] || 'info'
}

const getRiskLevelText = (riskLevel) => {
  const riskTextMap = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机'
  }
  return riskTextMap[riskLevel] || '未知风险等级'
}
//
const formItem=reactive([
  {comp:'input',label:'用户ID',prop:'userId',placeholder:'请输入用户ID'},
  {comp:'select',label:'情绪评分',prop:'mooodScore',placeholder:'请选择情绪评分',
    options:[
      {label:'低分(1-3)',value:'1-3'},
      {label:'中分(4-6)',value:'4-6'},
      {label:'高分(7-10)',value:'7-10'},
    ]
  },
])
const listData=ref([])
const pagination=reactive({
  currentPage:1,
  size:5,
  total:0
})
const handleSearch=async(formData)=>{
  const params={
    ...pagination,
    ...formData
  }
  const {records,total} =await getEmotionsList(params)
 
  console.log(total)
  listData.value=records
  pagination.total=total
  console.log(pagination.total)
}
onMounted(()=>{
  handleSearch({})
  console.log(pagination.total)
})
const handleChange=(currentPage)=>{
  pagination.currentPage=currentPage
  handleSearch({})
}
const dialogVisible=ref(false)
const currentDetail=ref(null)
const aiDetail=ref(null)
const handleDialogDetail=(row)=>{
  currentDetail.value=row
   dialogVisible.value=true
   if(currentDetail.value.aiEmotionAnalysis){
    aiDetail.value=JSON.parse(currentDetail.value.aiEmotionAnalysis)
    console.log(aiDetail.value)
   }
   else {
    aiDetail.value={}
   }
   console.log(currentDetail.value)
}
//删除
const handleDelete=async(row)=>{
  ElMessageBox.confirm(
    `确认删除该条记录吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(async ()=>{
    await deleteEmotion(row.id)
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    handleSearch()
  }
  )
}
</script>



<template>
  <div class="emotions-container">
    <PageHeade title="情绪日志"/>
    <TabSearch :formItem="formItem" @search="handleSearch"/>
    <el-table
      :data="listData"
      style="width: 100%"
    >
      <el-table-column prop="id" label="用户ID" width="80" />
      <el-table-column  label="会话ID" width="80" >
        <template #default="scope">
          <el-avatar>{{scope.row.nickname}}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="diaryDate" label="记录日期" width="120" />
      <el-table-column  label="情绪评分"  >
        <template #default="scope">
         <el-rate :model-value="scope.row.moodScore" disabled :max="10"></el-rate>
        </template>
      </el-table-column>
      <el-table-column  label="生活指标" width="120" >
        <template #default="scope">
         <div>
          <p>
            睡眠：{{ scope.row.sleepQuality }} / 5
          </p>
           <p>
            压力：{{ scope.row.stressLevel }} / 5
          </p>
         </div>
        </template>
      </el-table-column>
      <el-table-column prop="emotionTriggers" label="情绪触发因素" width="120" />
        <el-table-column prop="diaryContent" label="日记内容" width="250" />
        <el-table-column label="操作" width="240" fixed="right">
      <template #default="scope">
          <el-button text type="primary"  @click="handleDialogDetail(scope.row)">详情</el-button>
          <el-button   text type="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
     <el-pagination
    style="margin-top: 25px;"
    layout=" prev, pager, next,"
    :total="pagination.total"
    :page-size="pagination.size"
    @current-change="handleChange" />
    <el-dialog
    v-model="dialogVisible"
    title="情绪详情"
    width="800px"
    :close-on-click-modal="false"
    >
   <div v-if="currentDetail" class="detail-content">
    <div class="detail-section">
      <h4>用户信息</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">{{currentDetail.username}}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{currentDetail.nickname}}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{currentDetail.userId}}</el-descriptions-item>
        <el-descriptions-item label="记录日期">{{currentDetail.diaryDate}}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="detail-section">
      <h4>情绪状态</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="情绪评分">
          <el-rate :model-value="currentDetail.moodScore" disabled :max="10"></el-rate>
        </el-descriptions-item>
        <el-descriptions-item label="主要情绪">
          <el-tag :type="getEmotionTagType(currentDetail.dominantEmotion)">{{currentDetail.dominantEmotion||'-'}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="睡眠质量">
          {{currentDetail.sleepQuality||'-'}} / 5
        </el-descriptions-item>
        <el-descriptions-item label="压力水平">
          {{currentDetail.stressLevel||'-'}} / 5
        </el-descriptions-item>
      </el-descriptions>
    </div>
       <div class="detail-section">
        <h4>日记内容</h4>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="情绪触发因素">{{currentDetail.emotionTriggers||'无'}}</el-descriptions-item>
        <el-descriptions-item label="日记内容">{{currentDetail.diaryContent||'无'}}</el-descriptions-item>   
      </el-descriptions>
    </div>
     <div class="detail-section">
        <h4>AI情绪分析结果</h4>
        <div class="ai-analysis-result">
           <el-descriptions :column="2" border>
        <el-descriptions-item label="主要情绪">
          <el-tag :type="getAiEmotionTagType(aiDetail.primaryEmotion)">{{aiDetail.primaryEmotion||'-'}}</el-tag>
        </el-descriptions-item>
         <el-descriptions-item label="情绪强度">
        <el-progress :percentage="aiDetail.emotionScore||0" :color="getEmotionScoreColor(aiDetail.emotionScore)"></el-progress>
        </el-descriptions-item>
         <el-descriptions-item label="风险等级">
          <el-tag :type="getRiskLevelTagType(aiDetail.riskLevel)">{{aiDetail.riskLevel||'-'}}</el-tag>
        </el-descriptions-item>
          <el-descriptions-item label="情绪性质">
          <el-tag :type="aiDetail.isNegative?'danger':'success'">{{aiDetail.isNegative?'负面情绪':'正面情绪'}}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <div class="ai-suggestion-section">
       <h5>专业建议</h5>
       <div class="suggestion-content">{{aiDetail.suggestion||'无'}}</div>
      </div>
      <div class="ai-risk-section">
       <h5>风险描述</h5>
       <div class="risk-content">{{aiDetail.riskDescription||'无'}}</div>
      </div>
        <div class="ai-improvements-section">
       <h5>改善建议</h5>
       <div v-if="aiDetail.improvements" class="improvement-list">
        <li v-for="item in aiDetail.improvements" :key="item">{{item}}</li>
       </div>
       <div v-else>暂无改善建议</div>
      </div>
        </div>
     
    </div>
    <div class="detail-section">
      <h4>时间信息</h4>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="创建时间">{{aiDetail.createTime||'无'}}</el-descriptions-item>
        <el-descriptions-item label="记录时间">{{currentDetail.diaryDate}}</el-descriptions-item>
      </el-descriptions>
    </div>
   </div>
   <template #footer>
    <el-button type="danger" @click="dialogVisible = false">关闭</el-button>
   </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.detail-content {
  .detail-section {
    margin-bottom: 24px;
    
    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
      
      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}

// AI分析相关样式
.ai-analysis-status {
  .ai-status-tag {
    margin-bottom: 4px;
    
    i {
      margin-right: 4px;
    }
  }
  
  .ai-analysis-preview {
    font-size: 11px;
    color: #909399;
    margin-top: 2px;
  }
}

.ai-analysis-result {
  .ai-keywords-section,
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;
    
    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
      
      i {
        margin-right: 6px;
        color: #909399;
      }
    }
  }
  
  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .keyword-tag {
      background-color: #e1f3d8;
      color: #67c23a;
      border-color: #b3d8a4;
    }
  }
  
  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }
  
  .improvement-list {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
  
  .ai-analysis-meta {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebeef5;
    
    .analysis-time {
      margin: 0;
      font-size: 12px;
      color: #909399;
      
      i {
        margin-right: 4px;
      }
    }
  }
  
  .el-progress {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>
