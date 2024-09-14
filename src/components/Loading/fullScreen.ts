import { ElLoading } from "element-plus";

/* 全局请求 Loading*/
let loadingInstance: ReturnType<typeof ElLoading.service>; 

/**
 * @description 开启全局Loading
 * */
const startLoading = () => {
  ElLoading.service({
    fullscreen: true,
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)"
  });
};

/**
 * @description 关闭全局Loading
 * */
const endLoading = () => {
  loadingInstance.close();
};
 
/**
 * @description 显示全屏加载
 * */
let needLoadingRequestCount = 0;
export const showFullScreenLoading = () => {
  if (needLoadingRequestCount === 0) startLoading();
  needLoadingRequestCount++;
};

/**
 * @description 显示全屏加载
 * */
export const tryHideFullScreenLoading = () => {
  if (needLoadingRequestCount <= 0) return;
  if (needLoadingRequestCount === 0) endLoading();
};
