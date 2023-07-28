<!--
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-09-29 11:46:12
 * @LastEditors: 金苏
 * @LastEditTime: 2021-10-09 13:24:34
-->
<template>
  <div class="h-full w-full">
    <div class="w-1/2 margin h-14">
      <el-button @click="redirect">切换路由</el-button>
     </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    redirect() {
      this.$router.push({
        path: this.$route.path + `?name=${Math.random() *  10}`
      })
    }
  }
};
</script>
<style lang="stylus" scoped>
.margin {
  margin: 0 auto;
}

.border {
  width: 26px;
  height: 100%;
  font-size: 24px;
  background: white;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  width: 30px;
  border-left: 1px solid #eee;
  font-size: 20px;
}
</style>