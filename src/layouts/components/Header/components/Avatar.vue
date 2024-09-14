<template>
  <el-dropdown trigger="click">
    <div class="avatar">
      <img src="@/assets/images/avatar.gif" alt="avatar" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="openDialog('infoRef')">
          <el-icon><User /></el-icon>{{ $t("header.personalData") }}
        </el-dropdown-item>
        <el-dropdown-item @click="openDialog('passwordRef')">
          <el-icon><Edit /></el-icon>{{ $t("header.changePassword") }}
        </el-dropdown-item>
        <el-dropdown-item>
          <el-icon><SwitchButton /></el-icon>{{ $t("header.logout") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <InfoDialog ref="infoRef" />
  <PasswordDialog ref="passwordRef" />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import InfoDialog from './InfoDialog.vue';
  import PasswordDialog from './PasswordDialog.vue';

  const infoRef = ref<InstanceType<typeof InfoDialog> | null>(null);
  const passwordRef = ref<InstanceType<typeof PasswordDialog> | null>(null);

  const openDialog = (ref: string) => {
    if (ref === "infoRef") infoRef.value?.openDialog();
    if (ref === "passwordRef") passwordRef.value?.openDialog();
  };
</script>

<style scoped lang="scss">
.avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
