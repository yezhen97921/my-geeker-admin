import { createApp } from 'vue';
import App from './App.vue';

// reset style sheet
import '@/styles/reset.scss';

// css common style sheet
import '@/styles/common.scss';

// element css
import "element-plus/dist/index.css";

// custom element css
import "@/styles/element.scss";

// element dark css
import "element-plus/theme-chalk/dark/css-vars.css";

// custom element dark css
import "@/styles/element-dark.scss";

// font css
import "@/assets/fonts/font.scss";

// iconfont-css
import "@/assets/iconfont/iconfont.scss";


// element plus
import ElementPlus from 'element-plus';

// element icons
import * as Icons from '@element-plus/icons-vue';

// vue Router
import router from '@/routers';

// pinia
import pinia from '@/stores';

// vue i18n
import I18n from "@/languages/index";

const app = createApp(App);

// 将element plus icon 注册为全局组件
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key as keyof typeof Icons]);
});

app.use(ElementPlus, { size: 'small', zIndex: 3000 }).use(pinia).use(I18n).use(router).mount('#app');
