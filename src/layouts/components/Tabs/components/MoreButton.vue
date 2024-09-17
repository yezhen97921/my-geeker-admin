<template>
  <el-dropdown trigger="click" :teleported="false">
    <div class="more-button">
      <i class="iconfont icon-xiala"></i> 
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="refresh">
          <el-icon><Refresh /></el-icon>{{ $t("tabs.refresh") }}
        </el-dropdown-item>
        <el-dropdown-item @click="maximize">
          <el-icon><FullScreen /></el-icon>{{ $t("tabs.maximize") }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="closeCurrentTab">
          <el-icon><Remove /></el-icon>{{ $t("tabs.closeCurrent") }}
        </el-dropdown-item>
        <el-dropdown-item @click="tabsStore.closeTabsOnSide(route.fullPath, 'left')">
          <el-icon><DArrowLeft /></el-icon>{{ $t("tabs.closeLeft") }}
        </el-dropdown-item>
        <el-dropdown-item @click="tabsStore.closeTabsOnSide(route.fullPath, 'right')">
          <el-icon><DArrowRight /></el-icon>{{ $t("tabs.closeRight") }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="tabsStore.closeMultipleTab(route.fullPath)">
          <el-icon><CircleClose /></el-icon>{{ $t("tabs.closeOther") }}
        </el-dropdown-item>
        <el-dropdown-item @click="closeAllTab">
          <el-icon><FolderDelete /></el-icon>{{ $t("tabs.closeAll") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { HOME_URL } from '@/config';
import { inject, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useKeepAliveStore } from '@/stores/modules/keepAlive';
import { useGlobalStore } from '@/stores/modules/global';
import { useTabsStore } from '@/stores/modules/tabs';

const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const globalStore = useGlobalStore();
const tabsStore = useTabsStore();

const refreshCurrentPage: Function = inject("refresh") as Function;
const refresh = () => {
  setTimeout(() => {
    route.meta.isKeeoAlive && keepAliveStore.removeKeepAliveName(route.fullPath as string);      
    refreshCurrentPage(false);
    nextTick(() => {
      route.meta.isKeeoAlive && keepAliveStore.addKeepAliveName(route.fullPath as string);      
      refreshCurrentPage(true);
    });
  }, 0);
};

const maximize = () => {
  globalStore.setGlobalState("maximize", true);
};

const closeCurrentTab = () => {
  if (route.meta.isAffix) return;
  tabsStore.removeTabs(route.fullPath);
}

const closeAllTab = () => {
  tabsStore.closeMultipleTab(); 
  router.push(HOME_URL); 
}
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>
