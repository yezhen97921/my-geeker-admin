
<template>
  <el-config-provider>
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts"> 
  import { onMounted } from 'vue';
  import { useGlobalStore } from './stores/modules/global';
  import { LanguageType } from './stores/interface';
  import { getBrowserLang} from "@/utils";
  import { useI18n } from 'vue-i18n';
  import { ElConfigProvider } from 'element-plus';
  
  const globalStore = useGlobalStore();

  // init language
  const i18n = useI18n();
  onMounted(() => {
    const language = globalStore.language ?? getBrowserLang();
    i18n.locale.value = language;
    globalStore.setGlobalState("language", language as LanguageType);
  });
</script>

<style scoped lang="scss"></style>
