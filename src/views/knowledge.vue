<script setup>
import PageHeade from '@/components/PageHeade.vue'
import TabSearch from '@/components/TabSearch.vue'
import { createTree,getArticleDetail,changeArticleStatus,deleteArticle } from '@/apis/admin'
import { onMounted, reactive, ref,computed } from 'vue'
import { articlePage } from '@/apis/admin'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { ElMessageBox,ElMessage } from 'element-plus'
const formItem=[
  {
  comp:'input',
  label:'文章标题',
  prop:'title',
  placeholder:'请输入文章标题'
},
{
  comp:'select',
  label:'文章分类',
  prop:'categoryId',
  placeholder:'请选择文章分类',
  options:[]
},
{
  comp:'select',
  label:'状态',
  prop:'status',
  placeholder:'请选择文章内容',
  options:[
    {
      label:'草稿',
      value:0
    },
    {
      label:'已发布',
      value:1
    }
    ,
    {
      label:'已删除',
      value:2
    }
  ]
  
}
]
//分类映射
const categoryMap=reactive({})
//分类列表
const categories=ref([])
onMounted(async ()=>{
  const data=await createTree()
  
  categories.value=data.map(item=>{
    categoryMap[item.id]=item.categoryName
    return {
      label:item.categoryName,
      value:item.id
  }
})

formItem[1].options=categories.value
handleSearch()
})

//分页参数
const pagination=reactive({
  currentPage:1,
  size:5,
  total:0
})
const handleSearch=async(formData)=>{
  loading.value=true
  console.log(formData)
  
  const params={
    ...pagination,
    ...formData
  }
  console.log(params)
  const {records,total} =await articlePage(params)
  loading.value=false
  listTable.value=records
  pagination.total=total
  //console.log(listTable.value)
  //console.log(pagination.total)
}
//列表渲染
const listTable=ref([])
//分页
const handleChange=(currentPage)=>{
  pagination.currentPage=currentPage
  handleSearch()
}
//文章详情弹窗
const handleClose=()=>{
  visible.value=false
}
const visible=ref(false)


//编辑文章部分
const currentArticle=ref({})
const handleEdit=async (row)=>{
  if(!row.id)//新增文章
 {
    currentArticle.value={}
    visible.value=true
    return
  }
  else//编辑文章
  {
    const res=await getArticleDetail(row.id)
    currentArticle.value=res
    visible.value=true

  }
}
//更新成功
const handleSuccess=()=>{
  handleSearch()
}
//发布文章
const handlePublish=async (row)=>{
  ElMessageBox.confirm(
    `确认发布文章${row.title}吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(async ()=>{
    await changeArticleStatus(row.id,{status:1})
    ElMessage({
      type: 'success',
      message: '发布成功'
    })
    handleSearch()
  }
  )
}
//下线文章
const handleDown=async (row)=>{
  ElMessageBox.confirm(
    `确认下线文章${row.title}吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async ()=>{
    await changeArticleStatus(row.id,{status:2})
    ElMessage({
      type: 'success',
      message: '下线成功'
    })
    handleSearch()
  }
  )
}
//删除文章
const handleDelete=async (row)=>{
  ElMessageBox.confirm(
    `确认删除文章${row.title}吗？`, '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(async ()=>{
    await deleteArticle(row.id)
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    handleSearch()
  }
  )
}
//加载状态
const loading=ref(false)
</script>

<template>
  <div class="knowledge-container" v-loading="loading">
    <PageHeade title="知识文章">
    <template #button>
      <el-button type="primary" @click="handleEdit({})">新增</el-button>
    </template>
  </PageHeade>
  <TabSearch :formItem="formItem" @search="handleSearch"/>
  <el-table
    :data="listTable"
    style="width: 100%;margin-top: 25px;"
  >
  //文章标题
  <el-table-column label="文章标题" width="200" fixed="left">
      <template #default="scope">
        
        <div style="display: flex; align-items: center">
          <el-icon><timer /></el-icon>
          <span style="margin-left: 10px">{{ scope.row.title }}</span>
        </div>
      </template>
    </el-table-column>
    //文章分类
    <el-table-column label="文章分类" width="200">
      <template #default="scope">
        <span style="margin-left: 10px">{{ categoryMap[scope.row.categoryId] }}</span>
      </template>
    </el-table-column>

    <el-table-column prop="authorName" label="作者" width="200" />
    <el-table-column prop="readCount" label="阅读量" width="200" />
    <el-table-column prop="createdAt" label="发布时间" width="200" />
//操作
     <el-table-column label="操作" width="240" fixed="right">
      <template #default="scope">
          <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button @click="handlePublish(scope.row)" v-if="scope.row.status==0||scope.row.status==2" text type="success">发布</el-button>
          <el-button @click="handleDown(scope.row)" v-if="scope.row.status==1" text type="warning">下线</el-button>
          <el-button @click="handleDelete(scope.row)"  text type="danger">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    style="margin-top: 25px;"
    layout=" prev, pager, next,"
    :total="pagination.total"
    :page-size="pagination.size"
    @current-change="handleChange" />
    <ArticleDialog v-model:visible="visible" :categories="categories" @success="handleSuccess" :currentArticle="currentArticle"/>
  </div>
</template>