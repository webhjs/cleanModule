<!--
 * @Description:
     基于vue2.x.x、vue-router3.x 版本的keepalive
     支持  
        1、路由 判断 前进/后退状态
        2、路由 缓存
        3、路由 h5、pc 切换过渡动效
        4、路由iframe 缓存
     后期可以考虑放在npm包里
 * @Author susu
 * @create 2022/12/27 20:58
 -->
<template>
  <div :class="['router-view-cache-v2', customClass]">
    <transition :name="comTransitionName" :mode="mode" :appear="appear">
      <!-- 普通路由  -->
      <keep-alive :include="comCacheRoutes" :exclude="exclude" :max="max">
        <router-view
          v-if="isReload && !comIsIframeCacheRoute"
          :key="$route.fullPath"
          class="router-view router-view-pain"
          ref="routerViewRef"
        >
        </router-view>
      </keep-alive>
    </transition>

    <transition-group
      :name="comTransitionName"
      :mode="mode"
      :appear="appear"
      tag="div"
      class="router-view router-view-iframe"
    >
      <!-- iframe的  -->
      <template v-for="item in iframeComponents">
        <component
          :is="item.component"
          v-show="$route.fullPath === item.fullPath"
          :key="item.key"
          :ref="`iframe${item.fullPath.replace(/\//g, '')}Ref`"
          class="router-view__inner"
        ></component>
      </template>
    </transition-group>
  </div>
</template>

<script>
import { isObject, parseJsonNoError, eachTree, uuid } from '@bianpengfei/utils'
import { generateNavAttr, rmCacheRoute, proxyArrayProto, activateChildComponent, deactivateChildComponent } from './utils'
import setting from '@/setting'

let _routeDirection = '' // 路由方向
const _routingStackHistory = parseJsonNoError(sessionStorage.ROUTING_STACK_HISTORY) || [] // 路由堆栈历史
const _iframeRoutes = []
const _maxRoutingStackHistoryLen = 500

proxyArrayProto(_routingStackHistory, () => {
  if (_routingStackHistory.length > _maxRoutingStackHistoryLen) {
    // 堆栈历史路由，如果超过最大堆栈历史路由
    _routingStackHistory.splice(0, 1)
  }
  sessionStorage.ROUTING_STACK_HISTORY = JSON.stringify(_routingStackHistory)
})

export default {
  name: 'g-router-view-cache-v2',
  props: {
    /**
     *  stack:类似app那样回退（返回）自动销毁缓存vNode，适用场景主要用于h5
     *  flat：平铺化路由，不会去自动销毁缓存vNode，适用场景主要用于pc
     */
    cacheMode: {
      type: String,
      default: 'stack', // stack flat
      validator: (val) => ['stack', 'flat'].includes(val)
    },
    // 是否开启路由缓存
    pageCache: {
      type: Boolean,
      default: setting.pageCache
    },
    // 过度动画名称
    transitionName: {
      type: String,
      default: ''
    },
    // 是否开启路由过度动画
    transition: {
      type: Boolean,
      default: setting.routeTransition
    },
    // 缓存的最大值
    max: {
      type: Number,
      default: 99
    },
    // 包括name
    include: {
      type: [Array, String],
      default: () => []
    },
    // 是否第一动画
    appear: {
      type: Boolean,
      default: true
    },
    // 包括name
    mode: {
      type: String,
      default: '' // out-in【当pc端时，设置out-in 配合transitionName="slide-transform"】
    },
    // 排除缓存name
    exclude: {
      type: [Array, String],
      default: () => []
    },
    // 自定义类名
    customClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      componentWrapKey: uuid(),
      isReload: true,
      cacheRoutes: [],
      innerTransitionName: 'fade', // 动画
      routingStack: [], // 路由堆栈
      iframeComponents: [] // iframe组件
    }
  },

  computed: {
    comIsIframeCacheRoute() {
      return this.isCanCache(this.$route) && this.$route.meta?.iframe === true
    },
    comTransitionName() {
      if (this.transition) {
        return this.transitionName ? this.transitionName : this.innerTransitionName || ''
      }
      return ''
    },
    comCacheRoutes() {
      if (!this.pageCache) return []
      return [
        ...new Set([
          ...(this.$router?.getRoutes?.() || [])
            .filter((v) => v?.components?.name && v?.meta?.permanentCache === true)
            .map((v) => v?.components?.name || v?.name),
          ...this.routingStack.reduce((pre, cur) => {
            if (Array.isArray(cur)) {
              cur.forEach((v) => {
                if (v.name && this.isCanCache(v)) pre.push(v.name)
              })
            } else if (isObject(cur)) {
              if (cur.name && this.isCanCache(cur)) pre.push(cur.name)
            }
            return pre
          }, []),
          ...this.include
        ])
      ]
    }
  },

  watch: {
    /**
     * @description 监听路由变化
     */
    $route: {
      handler(newVal, oldVal) {
        if (this.isCanCache(newVal) && newVal?.meta?.iframe === true) {
          let ctor = this.iframeComponents.find((v) => v.fullPath == this.$route.fullPath)
          const refName = `iframe${newVal.fullPath.replace(/\//g, '')}Ref`
          if (!ctor) {
            const instance = newVal.matched.at(-1)?.components?.default
            this.iframeComponents.push({
              fullPath: newVal.fullPath,
              key: uuid(),
              component: instance
            })
            this.$nextTick(() => {
              const [componentInstance] = this.$refs[refName] || []
              console.log('componentInstance', componentInstance)
              if (componentInstance) {
                const vnode = componentInstance.$vnode
                vnode.data.keepAlive = true
                componentInstance && activateChildComponent(componentInstance)
              }
            })
          } else {
            const [componentInstance] = this.$refs[refName] || []
            componentInstance && activateChildComponent(componentInstance)
          }
        }
        if (this.isCanCache(oldVal) && oldVal?.meta?.iframe === true) {
          const refName = `iframe${oldVal.fullPath.replace(/\//g, '')}Ref`
          const [componentInstance] = this.$refs[refName] || []
          componentInstance && deactivateChildComponent(componentInstance)
        }
        // 1、设置路由 前进还是后退
        if (newVal?.fullPath == '/' || !oldVal?.fullPath) {
          // 第一次进来
          _routeDirection = ''
          this.innerTransitionName = 'fade'
        } else {
          const isExist = this.routingStack.some((v) => v?.fullPath == newVal?.fullPath)
          if (isExist) {
            // 已存在
            _routeDirection = 'backward' // 后退
            this.innerTransitionName = 'pop-out' //  'pop-out'
          } else {
            // 不存在
            this.innerTransitionName = 'pop-in'
            _routeDirection = 'forward' // 前进
          }
        }
        const navAttr = generateNavAttr(newVal)
        _routingStackHistory.push(navAttr)
        this.pushRoutingStack(navAttr)
        this.$emit('route-change', {
          routeDirection: _routeDirection, // 方向
          toFullPath: newVal.fullPath,
          fromFullPath: oldVal?.fullPath,
          route: newVal,
          routingStack: this.routingStack,
          routingStackHistory: _routingStackHistory
        })
      },
      immediate: true
    },
    /**
     * @description 监听堆栈变化
     */
    routingStack: {
      handler(newVal, oldVal) {
        if (this.cacheMode == 'stack') {
          // 堆栈缓存模式
          if (newVal.length < oldVal.length) {
            const removeView = oldVal.find((o) => {
              return newVal.findIndex((i) => i.fullPath === o.fullPath) < 0
            })
            if (removeView && removeView.meta?.cache !== false) {
              this.$nextTick(() => {
                this.rmCacheRoute(removeView.fullPath)
              })
            }
          }
        } else {
          // 预留后期扩展 平铺缓存模式
        }
        sessionStorage.ROUTING_STACK = JSON.stringify(newVal)
      }
    }
  },

  created() {
    const localCacheMode = parseJsonNoError(sessionStorage.CACHE_MODE) || ''
    if (localCacheMode != this.cacheMode) {
      sessionStorage.ROUTING_STACK_HISTORY = JSON.stringify([])
      sessionStorage.ROUTING_STACK = JSON.stringify([])
    }
    sessionStorage.CACHE_MODE = JSON.stringify(this.cacheMode)
  },

  methods: {
    /**
     * @description 根据fullPath， 删除 keepalive 缓存中的路由
     * @expose 对外暴露
     * @param fullPath
     */
    rmCacheRoute(fullPath = this.$route.fullPath) {
      const cacheRouteInstance = this.$children.find((o) => o?.$vnode?.data?.key === fullPath)
      const cache = cacheRouteInstance?.$vnode?.parent.componentInstance?.cache
      const keys = cacheRouteInstance?.$vnode?.parent?.componentInstance?.keys
      if (keys && Array.isArray(keys)) {
        const index = keys.findIndex((v) => v.includes(fullPath))
        if (index >= 0) {
          delete cache[keys[index]]
          keys.splice(index, 1)
        }
      }
      cacheRouteInstance && cacheRouteInstance.$destroy()
    },

    /**
     * @description 重新加载
     * @param {Object} curRoute 当前路由实例
     * @expose 对外暴露
     * @return
     */
    reload(curRoute = this.$route) {
      if (this.isCanCache(curRoute)) {
        // 处理是iframe的
        if (curRoute?.meta?.iframe === true) {
          const refName = `iframe${curRoute.fullPath.replace(/\//g, '')}Ref`
          if (this.$refs[refName]) {
            const [componentInstance] = this.$refs[refName]
            if (componentInstance) {
              componentInstance.$destroy()
              const idx = this.iframeComponents.findIndex((v) => v.fullPath == curRoute.fullPath)
              if (~idx) {
                this.iframeComponents.splice(idx, 1)
                setTimeout(() => {
                  this.iframeComponents.push({
                    fullPath: curRoute.fullPath,
                    key: uuid(),
                    component: curRoute.matched.at(-1)?.components?.default
                  })
                }, 16)
              }
            }
          }
        } else {
          // 普通路由
          this.$refs.routerViewRef && rmCacheRoute(this.$refs.routerViewRef)
        }
      }

      this.isReload = false
      setTimeout(() => {
        this.$nextTick(() => {
          this.isReload = true
        })
      }, 20)
    },

    /**
     * @description 添加路由堆栈
     * @param {Object} data 当前路由实例
     * @return
     */
    pushRoutingStack(data) {
      if (this.cacheMode == 'stack') {
        // 堆栈缓存模式
        const idx = this.routingStack.findIndex((v) => v.fullPath == data.fullPath)
        let routeStackNew = this.routingStack.slice(0)
        if (idx >= 0) {
          routeStackNew = this.routingStack.slice(0, idx + 1)
        } else {
          routeStackNew.push(data)
        }
        this.routingStack = routeStackNew
      } else {
        // 平铺缓存模式
        this.routingStack.push(data)
      }
    },

    /**
     * 获取iframe Routes components
     * @returns {[]}
     */
    getIframeComponents() {
      const routes = this.$router.options.routes
      console.log('routes', routes)
      return eachTree({
        tree: routes,
        props: { children: 'children' },
        callbackItem: (item) => {
          // item => 当前树节点, index => 当前树节点索引, list => 当前树节点数组, parentObj => 父节点
          if (this.isCanCache(item) && item.meta?.iframe === true) {
            _iframeRoutes.push(item)
          }
        }
      })
    },

    /**
     * @description 判断路由是否可以缓存
     * @param {Object} data 当前路由实例
     * @return Boolean
     */
    isCanCache(route) {
      return this.pageCache && route?.meta?.cache !== false
    }
  }
}
</script>

<style scoped lang="less">
@import './transition.less';
.router-view-cache-v2 {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  content-visibility: auto;
  .router-view {
    width: inherit;
    height: inherit;
    .router-view__inner {
      width: inherit;
      height: inherit;
    }
  }
}
</style>
