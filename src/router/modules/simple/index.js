/*
 * @Descripttion:
 * @version:
 * @Author: 金苏
 * @Date: 2021-03-29 17:31:42
 * @LastEditors: 金苏
 * @LastEditTime: 2021-10-09 11:32:08
 */
import Layout from "@/libs/layout/Layout";
import { Lazy } from '@/libs/utils/custom';

export const constantRouterMap = [ ];
export const asyncRouterMap = [
  {
    path: "/",
    meta: { icon: "document-copy", title: "首页" },
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "/iframe",
        name: "iframe",
        meta: { icon: "document-copy", title: "框架" },
        component: () => Lazy(import("@/views/simple-template/home/iframe"))
      }
    ]
  }
];
