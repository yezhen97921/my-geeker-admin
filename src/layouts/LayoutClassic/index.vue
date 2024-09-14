<template>
  <el-container class="layout">
    <el-header>
      <div class="header-lf mask-image">
        <div class="logo flx-center">
          <img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
          <span class="logo-text">{{ title }}</span>
        </div>
        <ToolBarLeft />
      </div>
      <div class="header-ri">
        <ToolBarRight />  
      </div>
    </el-header>
    <el-container class="classic-content">
      <el-aside>
        <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
          <el-scrollbar>
            <el-menu
              :router="false"
              :default-active="activeMenu"
              :collapse="isCollapse"
              :unique-opened="accordion"
              :collapse-transition="false"
            >
              <SubMenu :menuList="menuList"></SubMenu>
            </el-menu> 
          </el-scrollbar> 
        </div>
      </el-aside>
      <el-container class="classic-main">
        <Main></Main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useGlobalStore} from '@/stores/modules/global';
  import { useAuthStore } from '@/stores/modules/auth';
  import ToolBarLeft from '../components/Header/ToolBarLeft.vue';
  import ToolBarRight from '../components/Header/ToolBarRight.vue';
  import SubMenu from '../components/Menu/SubMenu.vue';
  import Main from '../components/Main/index.vue';

  const title: string = import.meta.env.VITE_GLOB_APP_TITLE;
  const route = useRoute();
  const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);
  const globalStore = useGlobalStore();
  const isCollapse = computed(() => {
    return globalStore.isCollapse;
  });   
  const authStore = useAuthStore();
  const menuList = computed(() => authStore.showMenuListGet);
  const accordion = computed(() => globalStore.accordion);
  </script>

<style scoped lang="scss">
  @import "./index.scss";
</style>
