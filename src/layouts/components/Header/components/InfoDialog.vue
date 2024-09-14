<template>
  <el-dialog v-model="dialogVisible" width="500px" title="个人信息" draggable>
    <span>This is UserInfo</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const dialogVisible = ref<boolean>(false);
  const openDialog = () => {  
    dialogVisible.value = true;
  };
  defineExpose({ openDialog });
</script>

<style scoped lang="scss"></style>
