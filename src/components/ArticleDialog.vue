<script setup>
import { computed,defineEmits,defineProps,reactive,ref,nextTick,watch} from 'vue'
import { uploadFile, createArticle,updateArticle} from '@/apis/admin'
import { ElMessage } from 'element-plus'
import { fileBaseUrl } from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'

const emit=defineEmits(['update:visible','success'])
const props=defineProps({
  visible:{
    type:Boolean,
    default:false
  },
  categories:{
    type:Array,
    default:()=>[]
  },
  currentArticle:{
    type:Object,
    default:null
  }
})
//判断编辑文章还是新增文章
const isEdit=computed(()=>{
  return props.currentArticle?.id?true:false
})
//监听数据变化
watch(()=>props.currentArticle,(newVal)=>{
  if(newVal)
  {
    Object.assign(formData,newVal)
    businessId.value=newVal.id
    imgurl.value = newVal.coverImage ? `${fileBaseUrl}${newVal.coverImage}` : ''
  }
  else
  {
    businessId.value=null
    handleRemove()
  }
})





const dialogVisible=computed({
get()
{
  return props.visible
},
set(val)
{
  emit('update:visible',val)
}
})
//表单数据
const formData=reactive({
  "title":"",
  "content":"",   
  "coverImage":"",
  "categoryId":1,
  "summary":"",
  "tags":"",
  "id":"",
  //tags:[]
})
//表单校验规则
const rules=reactive({
  title:[
    {required:true,message:'请输入文章标题',trigger:'blur'},
    {max:200,message:'文章标题最多200个字符',trigger:'blur'}
  ],
  categoryId:[
    {required:true,message:'请选择文章分类',trigger:'change'}
  ],
  content:[
    {required:true,message:'请输入文章内容',trigger:'blur'},
    {max:500,message:'文章内容最多500个字符',trigger:'blur'}
  ],
})
//表单验证
//文章图片上传
const imgurl=ref('')
const beforeAvatarUpload=(file)=>{
  console.log(file)
  const isImage=file.type.startsWith('image/')
  const isLimit=file.size/1024/1024<5
  if(!isImage)
  {
    ElMessage.error('请上传图片')
    return false
  }
  if(!isLimit)
  {
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return true
}
//文章图片上传
const businessId=ref(null)
const handleUploadRequest=async({file})=>{
  //生成uuid
   businessId.value=crypto.randomUUID()
  const fileRes=await uploadFile(file,{
   id:businessId.value
  })
  console.log(fileRes)
  imgurl.value=`${fileBaseUrl}${fileRes.filePath}`
  formData.coverImage=fileRes.filePath
  console.log(imgurl.value)
}
//移除封面
const handleRemove=()=>{
  imgurl.value=''
  formData.coverImage=''
}
//文章内容富文本编辑器
const editorInstance=ref(null)
//文章内容富文本编辑器内容改变
const handleChange=(data)=>{
  formData.content=data.html
}

const handleEditorCreated=(editor)=>{
  editorInstance.value=editor
  if(formData.content&&editorInstance.value)
  {
    nextTick(()=>{
      editorInstance.value.setHtml(formData.content)
    })
  }
}

//内容预览
const previewContent=ref(false)
const handlePreview=()=>{
 previewContent.value=!previewContent.value
 }
 //提交表单
 
 const loading=ref(false)
 const formRef=ref()
  const handleSubmit=()=>{
   formRef.value.validate((valid,fields)=>{
     if(valid)
     {
      loading.value=true
      console.log(formData)
      const submitData={
        ...formData,
      }
    if(!isEdit.value)
    {//新增文章
      submitData.id=businessId.value
      createArticle(submitData).then(res=>{
        loading.value=false
       emit('success')
       dialogVisible.value=false
      })
    }
     else{
      //编辑文章
     updateArticle(businessId.value,submitData).then(res=>{
        loading.value=false
       emit('success')
       dialogVisible.value=false
      })
     }
      
     }
     else
     {
      ElMessage.error('请填写完整信息')
     }
   })
 }
 //关闭弹窗
 const handleClose=()=>{
  formRef.value.resetFields()
  businessId.value=null
  handleRemove()
  emit('update:visible',false)
 }
</script>



<template>
  <el-dialog
    :title="isEdit?'编辑文章':'新增文章'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
  <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable></el-input>
    </el-form-item>
   <el-form-item label="文章分类" prop="categoryId">
      <el-select v-model="formData.categoryId" placeholder="请选择文章分类">
        <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
     <el-form-item label="文章摘要" prop="summary">
      <el-input v-model="formData.summary" placeholder="请输入文章摘要" maxlength="1000" show-word-limit type="textarea" :rows="4"></el-input>
    </el-form-item>
    <el-form-item label="标签" prop="tags">
      <el-input-tag
    v-model="formData.tags"
    placeholder="请输入标签,最多5个标签"
    aria-label="Please click the Enter key after input"
    :max="5"
    size="default"
  />
    </el-form-item>
    <el-form-item label="文章图片" prop="coverImage">
      <div class="cover-upload">
      <el-upload
        class="avatar-uploader"
        action="#"
       :before-upload="beforeAvatarUpload"
       :http-request="handleUploadRequest"
       accept="image/*"
       :show-file-list="false"
      >
      <div v-if="!imgurl" class="cover-placeholder">
       <p>点击上传文章图片</p>
      </div>
        <img v-else :src="imgurl" alt="文章图片" class="cover-image" />
      </el-upload>
    <div v-if="imgurl" class="cover-remove">
      <el-button type="danger"size="mini" @click="handleRemove">移除封面</el-button>
    </div>
    </div><!-- 文章图片上传 -->
     </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <RichTextEditor v-model="formData.content"
      placeholder="请输入文章内容,支持富文本格式"
      :maxCharCount="500"
      @create="handleEditorCreated"
      @change="handleChange"
      min-height="400px"
      />
    </el-form-item>
  </el-form>
  <div v-if="previewContent">
    <h3>文章内容预览</h3>
    <div v-html="formData.content"></div>
  </div>
  <template #footer>
    <el-button  @click="handlePreview">{{ previewContent?'隐藏预览':'预览效果' }}</el-button>
    <el-button type="danger" @click="handleClose">取消</el-button>
    <el-button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit?'更新':'提交' }}</el-button>
  </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background: #f6f8fa;
}
.cover-image {
  width: 200px;
  height: 120px;
  display: block;
}
</style>