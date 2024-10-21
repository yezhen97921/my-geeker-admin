import { VNode, ComponentPublicInstance, Ref } from "vue";
import { BreakPoint, Responsive } from "@/components/Grid/interface";
import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import Protable from '@/components/ProTable/index.vue';

export interface EnumProps {
  label?: string; // 选项框显示的文字
  value?: string | boolean | number | any[];
  disabled?: boolean; 
  tagType?: string;
  children?: EnumProps[];
  [key: string]: any;
}; 

export type TypeProps = "index" | "selection" | "radio" | "expand" | "sort";

export type SearchType = "input" | "input" | "input-number" | "select" | "select-v2" | "tree-select" | "cascader" | "date-picker" | "time-picker" | "time-select" | "switch" | "slider";

export type SearchRenderScope = {
  searchParam: { [key: string]: any };
  placeholder: string;
  clearable: boolean;
  options: EnumProps[];
  data: EnumProps[];  
};  

export type SearchProps = {
  el?: SearchType; // 当前项搜索框的类型
  label?: string;
  props?: any;
  key?: string;
  tooltip?: string; 
  order?: number;
  span?: number;
  offset?: number;  
  defaultValue?: string | number | boolean | any[] | Ref<any>;
  render?: (scope: SearchRenderScope) => VNode;
} & Partial<Record<BreakPoint, Responsive>>;
