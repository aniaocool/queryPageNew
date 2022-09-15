<template>
  <div>
    <div class="d">{{ data }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from "vue";

let data = ref("i am b.vue");
</script>

<style lang="scss">
div.d {
  width: 100px;
  line-height: 40px;
  background: darkkhaki;
  color: white;
  margin-bottom: 10px;
}
</style>
