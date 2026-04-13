<!--
 * @Description: 首页
 * @version:
 * @Author:
 * @Date: 2021-10-27 10:59:17
 * @LastEditors: crane
 * @LastEditTime: 2026-04-13 21:58:46
-->
<template>
  <div>
    <el-scrollbar class="app-wrapper">
      <app-main ref="AppMain" class="main-content"></app-main>
    </el-scrollbar>
  </div>
</template>
<script>
import AppMain from '../App-main.vue'
export default {
  components: { AppMain },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>
