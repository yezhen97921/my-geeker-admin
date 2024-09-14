import { CustomAxiosRequestConfig } from "..";
import qs from "qs";
// 声明一个Map用于存储每个请求的标识和取消函数
let pendingMap = new Map<string, AbortController>();

// 序列化参数，确保对象属性顺序一致
const sortedStringify = (obj: any) => {
  return qs.stringify(obj, { arrayFormat: "repeat", sort: (a: any, b: any) => a.localeCompare(b) });
};

// 获取请求的唯一标识
export const getPendingUrl = (config: CustomAxiosRequestConfig) => {
  return [config.method, config.url, sortedStringify(config.data), sortedStringify(config.params)].join("&");
};

export class AxiosCanceler {
  /**
   * @description 添加请求
   * @param {Object} config 
   * @returns void
   * */
  addPending(config: CustomAxiosRequestConfig) {
    this.removePending(config);
    const url = getPendingUrl(config);
    const controller = new AbortController();
    config.signal = controller.signal;
    pendingMap.set(url, controller);
  }

  /**
   * @description 移除请求
   * @param {Object} config
   * @returns void
   * */ 
  removePending(config: CustomAxiosRequestConfig) {
    const url = getPendingUrl(config);
    const controller = pendingMap.get(url);
    if (controller) {
      controller.abort();
      pendingMap.delete(url);
    }
  }

  /**
   * @description 清空所有pending
   * */
  removeAllPending() {
    pendingMap.forEach(controller => {
      controller && controller.abort();
    });
    pendingMap.clear();
  }
};
