<template>
  <Maximize v-show="maximize"/>
  <Tabs></Tabs>
  <el-main>
    <router-view v-slot="{ Component, route }">
      <transition appear name="fade-transform" mode="out-in">
        <keep-alive :include="keepAliveName">
          <component v-if="isRouterShow" :is="createComponentWrapper(Component, route)" :key="route"></component>
        </keep-alive>
      </transition>
    </router-view>
  </el-main>
  <el-footer></el-footer>
</template>

<script setup lang="ts">
import { ref, provide, h, watch } from 'vue';
import {storeToRefs} from 'pinia';
import Tabs from '../Tabs/index.vue';
import Maximize from './components/Maximize.vue';
import { useKeepAliveStore } from '@/stores/modules/keepAlive';
import { useGlobalStore } from '@/stores/modules/global';

const keepAliveStore = useKeepAliveStore();
const { keepAliveName } = storeToRefs(keepAliveStore);
const globalStore = useGlobalStore(); 
const { maximize } = storeToRefs(globalStore);

// 注入刷新页面方法
const isRouterShow = ref<boolean>(true);
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val);
provide("refresh", refreshCurrentPage);

// 解决详情页 keep-alive 问题
const wrapperMap = new Map();
function createComponentWrapper(component, route) {
  if (!component) return;
  const wrapperName = route.fullPath;
  let wrapper = wrapperMap.get(wrapperName);
  if (!wrapper) {
    wrapper = { name: wrapperName, render: () => h(component) } 
    wrapperMap.set(wrapperName, wrapper);
  }
  return h(wrapper);
};

// 监听当前页面是否最大化， 动态添加class
watch(
  () => maximize.value,
  () => {
    const app = document.getElementById("app") as HTMLElement;
    if (maximize.value) {
      app.classList.add("main-maximize");
    } else {
      app.classList.remove("main-maximize");  
    }
  },
  {immediate: true}
)

</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
