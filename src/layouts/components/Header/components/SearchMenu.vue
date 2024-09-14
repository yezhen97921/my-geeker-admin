<template>
  <div class="search-menu">
    <i class="iconfont icon-sousuo toolBar-icon" @click="handleOpen"></i>
    <el-dialog 
      class="search-dialog" 
      :width="600" 
      top="10vh" 
      :show-close="false"
      v-model="isShowSearch"
    >
      <el-input
        v-model="searchMenu"
        ref="menuInputRef"
        placeholder="菜单搜索：支持菜单名称，路径"
        size="large"
        clearable
        :prefix-icon="Search"
      ></el-input>
      <div
        class="menu-list"
        ref="menuListRef"
        v-if="searchList.length"
      >
        <div 
          v-for="item in searchList"
          :key="item.path"
          :class="['menu-item', { 'menu-active': item.path === activePath }]"
          @mouseenter="mouseoverMenuItem(item)"
          @click="handleClickMenu"
        >
          <div class="menu-lf">
            <el-icon class="menu-icon">
              <component :is="item.meta.icon"></component>
            </el-icon>  
            <span class="menu-title">{{ item.meta.title }}</span>
          </div>
          <i class="iconfont icon-huiche menu-enter" @click="handleOpen"></i>
        </div>
      </div>
      <el-empty v-else class="mt20 mb20" :image-size="100" description="暂无菜单"></el-empty>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { useDebounceFn } from '@vueuse/core';
  import { ref, nextTick, watch, computed } from 'vue';
  import { Search } from '@element-plus/icons-vue';
  import { InputInstance } from 'element-plus';
  import { useAuthStore } from '@/stores/modules/auth';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const authStore = useAuthStore();
  const menuList = computed(() => {
    let resMenuList = authStore.flatMenuListGet.filter(item => !item.meta.isHide);
    return resMenuList;
  });
  const menuInputRef = ref<InputInstance | null>(null);
  const menuListRef = ref<Element | null>(null);
  const isShowSearch = ref<boolean>(false);
  const searchMenu = ref<string>("");
  const searchList = ref<Menu.MenuOptions[]>([]);
  const activePath = ref<string>("");

  watch(isShowSearch, (val) => {
    if (val) {
      document.addEventListener("keydown", keyboardOperation);
    } else {
      document.removeEventListener("keydown", keyboardOperation);
    }
  });
  const keyPressUpOrDown = (direction: number) => {
    const length = searchList.value.length;
    if (!length) return;
    const index = searchList.value.findIndex(item => item.path === activePath.value);
    const newIndex = (index + direction + length) % length;
    activePath.value = searchList.value[newIndex].path;
    if (!menuListRef.value?.firstElementChild) return;
    const menuItemHeight = menuListRef.value.firstElementChild.clientHeight + 12 || 0;
    menuListRef.value.scrollTop = newIndex * menuItemHeight;
  };
  const keyboardOperation = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      keyPressUpOrDown(-1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      keyPressUpOrDown(1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleClickMenu();
    }
  };
  
  const updateSearchList = () => {
    const lowerSearchMenu = searchMenu.value.toLowerCase();
    searchList.value = searchMenu.value
      ? menuList.value.filter(item => {
        let flag1 = item.path.toLowerCase().includes(lowerSearchMenu);
        let flag2 = item.meta.title.toLowerCase().includes(lowerSearchMenu);
        if (flag1 || flag2) return item;
      }) : [];
    activePath.value = searchList.value.length ? searchList.value[0].path : "";
  };
  const debouncedUpdateSearchList = useDebounceFn(updateSearchList, 300);
  watch(searchMenu, debouncedUpdateSearchList);

  const handleOpen = () => {
    isShowSearch.value = true;
    nextTick(() => {
      setTimeout(() => {
        menuInputRef.value?.focus();
      });
    });
  };
  const mouseoverMenuItem = (menu: Menu.MenuOptions) => {
    activePath.value = menu.path;
  };
  const handleClickMenu = () => {
    const menu = searchList.value.find(item => item.path === activePath.value);
    if (!menu) return;
    if (menu.meta?.isLink) window.open(menu.meta.isLink, "_blank");
    else router.push(menu.path);
    searchMenu.value = "";
    isShowSearch.value = false;
  };
</script>

<style scoped lang="scss">
.search-menu {
  :deep(.el-dialog) {
    border-radius: 4px;
    padding: 0;
    .el-dialog__header {
      display: none;
    }
  }
  .menu-list {
    max-height: 515px;
    margin-top: 15px;
    overflow: auto;
    .menu-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 45px;
      padding: 0 20px;
      margin: 10px 0;
      color: var(--el-text-color-secondary);
      cursor: pointer;
      background-color: transparent;
      border: 1px solid var(--el-border-color);
      border-radius: 6px;
      transition: all 0.2s ease;
      .menu-lf {
        display: flex;
        align-items: center;
      }
      .menu-icon {
        margin-right: 8px;
        font-size: 16px;
      }
      .menu-title {
        font-size: 14px;
      }
      .menu-enter {
        font-size: 17px;
      }
    }
    .menu-active {
      color: #ffffff;
      background-color: var(--el-color-primary);
      .menu-icon {
        font-size: 18px;
      }
      .menu-title {
        font-size: 16px;
      }
      .menu-enter {
        font-size: 19px;
      }
    }
  }
}
</style>
