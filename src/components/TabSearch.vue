<script setup>
import{reactive,ref,computed} from 'vue'


const props=defineProps({
  formItem:Array,
  default:()=>[]
})
const emit=defineEmits(['search'])
// 定义表单数据
const formData=reactive({})
const isComp=(comp)=>{
  return{
    input:'el-input',
    select:'el-select'
  }[comp]||'el-input'
}
const handleSearch=()=>{
  
  emit('search',formData)
}
// 重置表单
const ruleFormRef = ref()
const handleReset=(formEl)=>{
  if(!formEl) return
  formEl.resetFields()
  handleSearch()
}
//响应式
const formItemWithCol = computed(() => {
  return props.formItem.map(item => {
    item.col = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
    return item
  })
})
</script>

<template>
    <el-form :model="formData" ref="ruleFormRef">
      <el-row :gutter="24">
    <template v-for="item in formItemWithCol" :key="item.prop">
      <el-col v-bind="item.col">
      <el-form-item :label="item.label" :prop="item.prop">
         <component :is="isComp(item.comp)":placeholder="item.placeholder" v-model="formData[item.prop]">
          <template v-if="item.comp==='select'">  
            <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value"></el-option>     
         </template>
        </component>
      </el-form-item>
     </el-col>
    </template>
    </el-row>
     <el-row>
    <el-button type="primary" @click="handleSearch">查询</el-button>
    <el-button @click="handleReset(ruleFormRef)">重置</el-button>
    </el-row>
    </el-form>
</template>