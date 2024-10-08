<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="用户名: admin / user">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" placeholder="密码: 123456" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item> 
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)">重置</el-button>
    <el-button :icon="UserFilled" :loading="loading" round size="large" type="primary" @click="login(loginFormRef)">登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { HOME_URL } from '@/config';
import { Login } from '@/api/interface';
import { loginApi } from "@/api/modules/login";
import { useUserStore } from '@/stores/modules/user';
import { useTabsStore } from '@/stores/modules/tabs';
import { useKeepAliveStore } from '@/stores/modules/keepAlive';
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import {CircleClose, UserFilled} from '@element-plus/icons-vue';
import type { ElForm } from "element-plus";
import { ElNotification } from 'element-plus';
import md5 from "md5";

console.log('123');
const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();


type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});
const loading = ref<boolean>(false);
const loginForm = reactive<Login.ReqLoginForm>({
  username: 'admin',
  password: '123456'
});

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1, 执行登录接口
      const { data } = await loginApi({ ...loginForm, password: md5(loginForm.password) });
      userStore.setToken(data.access_token); 
      
      // 2,添加动态路由
      await initDynamicRouter();

      // 3, 清空tabs keepAlive 数据 
      tabsStore.setTabs([]);
      keepAliveStore.setKeepAliveName([]);

      // 4, 跳转到首页
      router.push(HOME_URL);
      ElNotification({
        title: "React 付费版本 🔥🔥🔥",
        dangerouslyUseHTMLString: true,
        message: "预览地址：<a href='https://pro.spicyboy.cn'>https://pro.spicyboy.cn</a>",
        type: "success",
        duration: 8000
      });

    } finally {
      loading.value = false;
    }
  })
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  formEl?.resetFields();
};

// onMounted
onMounted(() => {
  // 监听enter事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    if (["Enter", "enter", "NumpadEnter"].includes(e.code)) {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  }
});

// onBeforeUnmount
onBeforeUnmount(() => {
  document.onkeydown = null;
});

</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>

