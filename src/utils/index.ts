const mode = import.meta.env.VITE_ROUTER_MODE;
  
/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表（需剔除 isHide == true的菜单）  
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowMenuList(menuList: Menu.MenuOptions[]): Menu.MenuOptions[] {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter(item => {
    item.children?.length && (item.children = getShowMenuList(item.children)); 
    return !item.meta?.isHide;
  })
};

/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList
 * @returns {Array}
 * */
export function getFlatMenuList(menuList: Menu.MenuOptions[]): Menu.MenuOptions[] {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.flatMap(item => [item, ...(item.children ? getFlatMenuList(item.children) : [])]);
};

/**
 * @description 使用递归找出所有面包屑 存储到pinia中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {Object} result 处理后的结果
 * @returns {Object}
 * */
export const getAllBreadcrumbList = (menuList: Menu.MenuOptions[], parent = [], result: { [key: string]: any } = {}): { [key: string]: any } => {
  for (const item of menuList) {
    result[item.path] = [...parent, item];
    if (item.children) getAllBreadcrumbList(item.children, result[item.path], result);
  }
  return result;
}

/**
 * @description 获取不同路由模式对应的url 和 params
 * @returns {String}
 */ 
export const getUrlWithParams = (): string => {
  const url: { [key: string]: string } = {
    hash: location.hash.substring(1),
    history: location.pathname + location.search
  }
  return url[mode];
};

/**
 * @description 获取浏览器默认语言
 * @returns {String}
 */
export function getBrowserLang() {
  let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
  let defaultBrowserLang = "";
  if (["cn", "zh", "zh-cn"].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = "zh";
  } else {
    defaultBrowserLang = "en";
  }
  return defaultBrowserLang;
}
