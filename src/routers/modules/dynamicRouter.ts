import router from "..";
import { LOGIN_URL } from "@/config";
import { RouteRecordRaw } from "vue-router";
import { ElNotification } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { useAuthStore } from "@/stores/modules/auth"; 

//  引入views文件夹下所有vue文件
const modules = import.meta.glob("@/views/**/*.vue");

/**
 * @description 初始化动态路由
 * */
export const initDynamicRouter = async () => {
  const userStore = useUserStore();
  const authStore = useAuthStore();
  
  try {
    // 1,获取菜单列表&按钮权限列表
    await authStore.getAuthMenuList();
    await authStore.getAuthButtonList();

    // 2,判断当前用户是否有菜单权限
    if (!authStore.authMenuList.length) {
      ElNotification({
        title: "无权限访问",
        message: "当前账号无任何菜单权限，请联系系统管理员！",
        type: "warning",
        duration: 3000
      });
      userStore.setToken("");
      router.replace(LOGIN_URL);
      return Promise.reject("No permission");
    }

    // 3,添加动态路由
    authStore.flatMenuListGet.forEach(item => {
      item.children && delete item.children;
      if (item.component && typeof item.component == "string") {
        item.component = modules["/src/views/" + item.component + ".vue"];
      }
      if (item.meta.isFull) {
        router.addRoute(item as unknown as RouteRecordRaw);
      } else {
        router.addRoute("layout", item as unknown as RouteRecordRaw);
      }
    })   
  } catch (error) {
    // 当按钮 || 菜单 请求接口出错的时候，重定向到登录页面
    userStore.setToken("");
    router.replace(LOGIN_URL);
    return Promise.reject(error);
  }
};
