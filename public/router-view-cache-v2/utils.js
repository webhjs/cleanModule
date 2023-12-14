/**
 * @Description: 路由缓存工具
 * @Author BPF
 * @create 2021/4/15 9:37
 */
import { uuid, isFunction, eachTree, def } from '@bianpengfei/utils'
import setting from '@/setting'
import VueRouter from 'vue-router'

/**
 * 对VueRouter二次封装
 */
export class CustomVueRouter extends VueRouter {
  constructor(
    options = {
      routes: [],
      mode: 'hash',
      fallback: undefined,
      base: undefined,
      linkActiveClass: undefined,
      linkExactActiveClass: undefined,
      parseQuery: undefined,
      stringifyQuery: undefined,
      scrollBehavior: undefined
    }
  ) {
    enhanceLoopRoutes(options.routes)
    super(options)
    enhanceProxyRouter(this)
  }
}

/**
 * 对VueRouter二次封装
 */
export function createCustomVueRouter(
  options = {
    routes: [],
    mode: 'hash',
    fallback: undefined,
    base: undefined,
    linkActiveClass: undefined,
    linkExactActiveClass: undefined,
    parseQuery: undefined,
    stringifyQuery: undefined,
    scrollBehavior: undefined
  },
  VueRouterCtor = VueRouter
) {
  enhanceLoopRoutes(options.routes)
  const router = new VueRouterCtor(options)
  enhanceProxyRouter(router)
  return router
}

/**
 * 异步加载路由
 * @param component  异步路由
 * @param routerConfig  路由配置对象，缓存路由时用到
 * @returns {Promise<unknown>}
 */
export async function lazy(component = Promise.resolve(), routerConfig = {}) {
  const _component = isFunction(component) ? await component() : await component
  // console.log('_component', _component, this)
  routerConfig.name = _component.default.name =
    routerConfig?.name || _component.default?.__file?.slice?.(0, -4)?.replaceAll('/', '-') || uuid()
  console.log('_component.default.name', _component.default.name)
  return Promise.resolve(_component)
}

/**
 * 递归处理 路由, 给其加上路由缓存 name
 * @param routes
 * @returns {[]}
 */
export function enhanceLoopRoutes(routes = []) {
  if (!routes) return []
  routes = Array.isArray(routes) ? routes : [routes]
  return eachTree({
    tree: routes,
    props: { children: 'children' },
    callbackItem: (item, index, list, parentObj) => {
      // item => 当前树节点, index => 当前树节点索引, list => 当前树节点数组, parentObj => 父节点
      // console.log('回调函数的值@callbackItem', item, index, list, parentObj)
      if (setting.pageCache && item.meta?.cache !== false) {
        let componentRef = item.component // 先引用之前的，形成闭包
        item.component = () => lazy(componentRef(), item)
      }
    }
  })
}

/**
 * 判断是否是 RouterConfig 类型
 * @param routerConfig
 * @returns {boolean}
 */
export function isRouterConfig(routerConfig) {
  return (
    Object.hasOwn(routerConfig, 'component') &&
    routerConfig.component &&
    (Object.hasOwn(routerConfig, 'path') || Object.hasOwn(routerConfig, 'name') || Object.hasOwn(routerConfig, 'meta'))
  )
}

/**
 * 代理router实例对象
 * @router 路由实例
 */
export function enhanceProxyRouter(router = {}) {
  const routerPrototype = router.__proto__
  const routerMethods = Object.create(routerPrototype)
  router.__proto__ = routerMethods

  def(routerMethods, 'vars', {
    // history: [], // 历史访问过历史
    // routeDirection: '' // 路由方向 forward：前进 backward：后退
  })

  const addRoutesMethodList = [{ methodName: 'addRoutes' }, { methodName: 'addRoute' }]
  addRoutesMethodList.forEach(({ methodName }) => {
    const origin = arrayPrototype.__proto__[methodName]
    const args = [...arguments]
    def(routerMethods, methodName, function () {
      switch (methodName) {
        case 'addRoute': {
          if (args.length == 1) {
            // 只有一个参数
            enhanceLoopRoutes(args[0])
          } else if (args.length == 2) {
            // 两个参数
            enhanceLoopRoutes(args[1])
          }
          break
        }
        case 'addRoutes': {
          const [$0] = args
          if (Array.isArray($0)) {
            isRouterConfig($0[0]) && enhanceLoopRoutes($0)
          }
          break
        }
      }
      return origin.apply(this, args)
    })
  })

  const stateChangeMethodList = [
    { methodName: 'push', routeDirection: 'forward' },
    { methodName: 'back', routeDirection: 'backward' },
    { methodName: 'go', routeDirection: 'backward' },
    { methodName: 'replace', routeDirection: '' }
  ]
  stateChangeMethodList.forEach(({ methodName, routeDirection }) => {
    const origin = routerMethods.__proto__[methodName]
    const vars = routerMethods.vars
    def(routerMethods, methodName, function () {
      let result = origin.apply(this, arguments)
      // if (isPromise(result)) {
      //   result.then(() => {})
      // } else {
      // }
      return result
    })
  })

  // 跳转之前
  router.beforeEach((to, from, next) => {
    next()
  })

  // 跳转之后
  router.afterEach((to, from) => {})
}

/**
 * 生成导航信息
 * @param route
 * @returns {{fullPath: *, path, meta, query, name: *, title, params, key: *}}
 */
export const generateNavAttr = (route = {}) => {
  return {
    name: route.matched?.slice(-1)?.shift()?.components?.default?.name || route.name,
    path: route.path,
    fullPath: route.fullPath || route.path,
    meta: route.meta,
    title: route.title || route?.meta?.title,
    params: route.params,
    query: route.query,
    index: route.fullPath || route.path,
    key: route.key || route.fullPath
  }
}

/**
 * 移除缓存路由 移除缓存
 * @param vm
 */
export const rmCacheRoute = (vm) => {
  if (vm?.$vnode?.data?.keepAlive) {
    if (vm?.$vnode?.parent.componentInstance?.cache)
      if (vm?.$vnode?.componentOptions) {
        let key =
          vm?.$vnode?.key == null
            ? vm?.$vnode?.componentOptions?.Ctor?.cid +
              (vm?.$vnode?.componentOptions?.tag ? `::${vm?.$vnode?.componentOptions?.tag}` : '')
            : vm?.$vnode?.key
        let cache = vm?.$vnode.parent?.componentInstance?.cache
        let keys = vm?.$vnode.parent?.componentInstance?.keys
        if (cache[key]) {
          if (keys.length) {
            let index = keys.indexOf(key)
            if (index > -1) {
              keys.splice(index, 1)
            }
          }
          delete cache[key]
        }
      }
    vm.$destroy()
  }
}

let arrayPrototype = Array.prototype
let arrayMethods = Object.create(arrayPrototype)
let methodsNeedChange = ['shift', 'unshift', 'pop', 'push', 'splice', 'reversed', 'sort']

/**
 * // 代理数组原型方法
 * @param target
 * @param cb
 */
export const proxyArrayProto = (target = [], cb) => {
  target.__proto__ = arrayMethods
  methodsNeedChange.forEach((methodName) => {
    def(arrayMethods, methodName, function () {
      const origin = arrayPrototype[methodName]
      let args = [...arguments]
      const result = origin.apply(this, args)
      cb && cb(target)
      return result
    })
  })
}

/**
 * 递归调用子/孙组件的生命周期方法。
 * @param {Array} children 子组件实例
 * @param {String} hook
 */
export function _loopCallChildHook(children = [], hook = '') {
  children.forEach((component) => {
    component.__proto__?.constructor?.extendOptions?.[hook]?.()
    if (Array.isArray(component.$children)) {
      _loopCallChildHook(component.$children)
    }
  })
}

/**
 * 激活子组件中所有的 activated 事件
 * @param vm
 */
export function activateChildComponent(vm) {
  _loopCallChildHook(vm.$children, 'activated')
}

/**
 * 激活子组件中所有的 deactivated 事件
 * @param vm
 */
export function deactivateChildComponent(vm) {
  _loopCallChildHook(vm.$children, 'deactivated')
}
