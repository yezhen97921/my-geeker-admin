<template>
  <div class="tabs-box">
    <div class="tabs-menu">
      <el-tabs v-model="tabsMenuValue" type="card" @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane v-for="item in tabsMenuList" :key="item.path" :label="item.title" :name="item.path" :closable="item.close">
          <template #label>
            <el-icon v-if="item.icon && tabsIcon" class="tabs-icon">
              <component :is="item.icon"></component>
            </el-icon>
            {{ item.title }}
          </template>
        </el-tab-pane> 
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Sortable from 'sortablejs';
  import { TabsPaneContext, TabPaneName } from 'element-plus';
  import { useGlobalStore } from '@/stores/modules/global';
  import { useTabsStore } from '@/stores/modules/tabs';
  import { useAuthStore } from '@/stores/modules/auth';


  const route = useRoute();
  const router = useRouter();
  const globalStore = useGlobalStore();
  const tabStore = useTabsStore(); 
  const authStore = useAuthStore();

  const tabsMenuValue = ref<string>(route.fullPath);
  const tabsMenuList = computed(() => tabStore.tabsMenuList);
  const tabsIcon = globalStore.tabsIcon;


  onMounted(() => {
    tabsDrop();
    initTabs(); 
  });

  watch(
    () => route.fullPath,
    () => {
      if (route.meta.isFull) return;
      tabsMenuValue.value = route.fullPath;
      const tabsParams = {
        icon: route.meta.icon as string,
        title: route.meta.title as string,
        path: route.fullPath,
        name: route.name as string,
        close: !route.meta.isAffix,
        isKeepAlive: route.meta.isKeepAlive as boolean
      };
      tabStore.addTabs(tabsParams);
    },
    { immediate: true }
  );

  // tabs 拖拽排序
  const tabsDrop = () => {
    Sortable.create(document.querySelector(".el-tabs__nav") as HTMLElement, {
      draggable: ".el-tabs__item",
      animation: 300,
      onEnd({ newIndex, oldIndex }) {
        const tabsList = [...tabStore.tabsMenuList];
        const currRow = tabsList.splice(oldIndex as number, 1)[0];
        tabsList.splice(newIndex as number, 0, currRow);
        tabStore.setTabs(tabsList);
      }
    });
  };  

  // 初始化需要固定的tabsIcon
  const initTabs = () => {
    authStore.flatMenuListGet.forEach(item => {
      if (item.meta.isAffix && !item.meta.isHide && !item.meta.isFull) {
        const tabsConfig = {
          icon: item.meta.icon,
          title: item.meta.title,
          path: item.path,
          name: item.name,
          close: !item.meta.isAffix,
          isKeepAlive: item.meta.isKeepAlive
        };
        tabStore.addTabs(tabsConfig);
      }
    })
  };

  const tabClick = (tabItem: TabsPaneContext) => {
    const fullPath = tabItem.props.name as string;
    router.push(fullPath);
  };
  const tabRemove = (fullPath: TabPaneName) => {
    tabStore.removeTabs(fullPath as string, fullPath === route.fullPath);
  };
</script>

<style scoped lang="scss"></style>
