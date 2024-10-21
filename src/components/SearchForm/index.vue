<template> 
  <div class="card table-search">
    <el-form ref="formRef" :model="searchParam">
      <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol"></Grid>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Grid from '@/components/Grid/index.vue';

// 是否默认折叠搜索项
const collapsed = ref<boolean>(true);
</script>

<style lang="scss" scoped></style> 
