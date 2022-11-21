<template>
  <div>
    <slot :value="[ 4 ]"></slot>
    <iframeCache2>
      <template slot-scope="scoped">
        <slot v-bind="scoped"></slot>
      </template>
    </iframeCache2>
  </div>
</template>

<script>
import iframeCache2 from '../iframe-cache2'
export default {
  components: { iframeCache2 }
}
</script>

<style>

</style>