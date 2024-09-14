// shims-vue.d.ts
import { ComponentCustomProperties } from 'vue';
import { I18n, TFunction } from 'vue-i18n';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: TFunction;
  }
}
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
