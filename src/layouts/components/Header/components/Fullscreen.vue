<template>
  <div class="fullscreen">
    <i :class="['iconfont toolBar-icon', isFullscreen ? 'icon-suoxiao' : 'icon-fangda']" @click="handleFullscreenChange"></i>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import screenfull from 'screenfull';
  import { ElMessage } from 'element-plus';

  const isFullscreen = ref<boolean>(screenfull.isFullscreen);

  onMounted(() => {
    screenfull.on("change", () => {
      isFullscreen.value = screenfull.isFullscreen;
    });
  });

  const handleFullscreenChange = () => {
    if (!screenfull.isEnabled) ElMessage.warning("当前您的浏览器不支持全屏 ❌");
    screenfull.toggle();
  };
</script>
