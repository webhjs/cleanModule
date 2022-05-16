/*
 * @Descripttion:
 * @version:
 * @Author: 金苏
 * @Date: 2021-03-24 11:15:16
 * @LastEditors: 金苏
 * @LastEditTime: 2021-08-30 13:18:22
 */
// 全局图标
import "@/libs/icons";
// 全局 Mock 接口
import "@/mock";
// 全局阿里字体图标库
import "@/libs/assets/aliFont/iconfont.css";
// 全局fontawesome字体图标
import "font-awesome/css/font-awesome.css";

import Api from "@/api"

// 自定义的全局组件
import Notification from "@/components/Notification";
// random
import random from "@/libs/utils/random";
// 导航栏无法收缩
import Fragment from "vue-fragment";

// 全局权限检查
import "@/permission";
// tooltip 溢出显示指令 v-ellipsis:top="li.name"
import Ellipsis from 'vue-directive-ellipsis'
import 'vue-directive-ellipsis/dist/ellipsis.umd.css'


import print from "@/libs/utils/print"

export function initSetup(Vue) {
  Vue.use(print)
  Vue.directive('ellipsis', Ellipsis);
  Vue.use(Api);
  Vue.use(random);
  Vue.use(Fragment.Plugin);
  Vue.use(Notification);
  Vue.prototype.$EventBus = new Vue(); // event bus
}
