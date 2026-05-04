<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="page-head" >
   <p class="page-title">{{ props.title }}</p>
   <div class="action-btn">
    <slot name="button"> </slot>
   </div>
  </div>
</template>

<style lang="scss" scoped>
.page-head {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .page-title {
    font-size: 24px;
   color: #2d3748;
  }
}
</style>
