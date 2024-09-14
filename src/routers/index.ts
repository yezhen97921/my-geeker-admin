import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { useAuthStore } from "@/stores/modules/auth";
import { LOGIN_URL, ROUTER_WHITE_LIST } from "@/config";
import { staticRouter, errorRouter } from "@/routers/modules/staticRouter";
import NProgress from "@/config/nprogress";
import {initDynamicRouter} from "./modules/dynamicRouter";

const mode: 'history' | 'hash' = import.meta.env.VITE_ROUTER_MODE;

const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory()
};
const router = createRouter({
  history: routerMode[mode](),
  routes: [...staticRouter],
  strict: false, // 控制路径匹配规则，例如末尾是否带有/
  scrollBehavior: () => ({ left: 0, top: 0 }) // 控制路由切换时页面滚动位置
});

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const authStore = useAuthStore();

  // 1，NProgress开始
  NProgress.start();

  // 2, 动态设置标题
  const title = import.meta.env.VITE_GLOB_APP_TITLE;
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

  // 3, 判断是访问登录页，有Token 留在当前页面，没有Token则重置路由至登录页面
  if (to.path.toLocaleLowerCase() === LOGIN_URL) {
    if (userStore.token) return next(from.fullPath);
    resetRouter();
    return next();
  }

  // 4, 判断访问页面是否在路由白名单地址中（静态路由), 如果存在，直接放行
  if (ROUTER_WHITE_LIST.includes(to.path)) return next();

  // 5, 判断是否有Token， 没有的话重定向到login页面
  if (!userStore.token) return next({ path: LOGIN_URL, replace: true });

  // 6, 如果没有菜单列表， 则重新请求菜单列表并添加动态路由
  if (!authStore.authMenuListGet.length) {
    await initDynamicRouter();
    return next({ ...to, replace: true });
  }

  // 7, 存储routerName， 做按钮权限筛选 
  authStore.setRouteName(to.name as string);

  // 8, 正常访问页面
  return next();
});

/**
 * @description 重置路由
 */
export const resetRouter = () => {
  const authStore = useAuthStore();
  authStore.flatMenuListGet.forEach(route => {
    const { name } = route;
    if (name && router.hasRoute(name)) router.removeRoute(name);
  })
};

/**
 * @description 路由跳转错误
 */
router.onError(error => {
  NProgress.done();
  console.warn("路由错误", error.message);
});

/**
 * @description 路由跳转结束
 */
router.afterEach(() => {
  NProgress.done();
});

export default router;
