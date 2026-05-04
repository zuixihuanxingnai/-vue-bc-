import request from '@/utils/request'
export function login(data){
  return request.post('/user/login',data)
}
export function createTree(){
  return request.get('/knowledge/category/tree')
}
export function articlePage(params){
  return request.get('/knowledge/article/page', { params })
}
export function uploadFile(file,businessInfo){
  const formData=new FormData()
  formData.append('file',file)
 formData.append('businessType','ARTICLE')
 formData.append('businessId',businessInfo.id)
 formData.append('businessField','cover')
 return request.post('/file/upload',formData,
  {
    headers:{
      'Content-Type':'multipart/form-data'
    }
  }
 )
}
export function createArticle(data){
  return request.post('/knowledge/article',data)
}

export function getArticleDetail(id){
  return request.get(`/knowledge/article/${id}`)
}
export function updateArticle(id,data){
  return request.put(`/knowledge/article/${id}`,data)
}
export function  changeArticleStatus(id,data){
  return request.put(`/knowledge/article/${id}/status`,data)
}
export function deleteArticle(id){
  return request.delete(`/knowledge/article/${id}`)
}

export function  getConsultationsList(params){
  return request.get('/psychological-chat/sessions', { params })
}
export function getSessionDetail(id){
  return request.get(`/psychological-chat/sessions/${id}/messages`)
}
export function getEmotionsList(params){
  return request.get('/emotion-diary/admin/page', { params })
}
export function deleteEmotion(id){
  return request.delete(`/emotion-diary/admin/${id}`)
}
export function getAlldetail()
{
  return request.get('/data-analytics/overview')
}
export function loginout(){
  return request.post('/user/logout')
}