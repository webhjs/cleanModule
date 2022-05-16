/*
 * @Author: your name
 * @Date: 2021-02-20 17:29:16
 * @LastEditTime: 2021-04-06 10:13:31
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\router\index.js
 */
import Vue from "vue";
import Router from "vue-router";

/*读取router配置*/
import { requireContext } from '@/libs/utils/custom';
export const modules = requireContext(require.context('./modules', true, /\.js$/))
// 合并路由信息
export const routerModules = Object.values(modules).reduce((pre, cur) => {
  const { asyncRouterMap, constantRouterMap } = cur
  return { 
    asyncRouterMap: pre.asyncRouterMap.concat(asyncRouterMap),
    constantRouterMap: pre.constantRouterMap.concat(constantRouterMap)
  }
}, { asyncRouterMap: [], constantRouterMap: [] })
/*读取router配置*/

const { constantRouterMap } = routerModules ? routerModules : { constantRouterMap: [] };

import { constantCommonRouterMap } from "@/router/common"

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);
const routerCreate = () => {
  return new Router({
    mode: 'history', // require service support
    // scrollBehavior: () => ({ y: 0 }),
    routes: constantCommonRouterMap.concat(constantRouterMap)
  })
}
const router = routerCreate()
export default router
