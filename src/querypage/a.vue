<template>
  <div>
    <div class="d">{{ data }}</div>
    <div class="d" v-for="item in arr" :key="item.name">
      {{ item.name }}
    </div>
    <!-- bb -->
    <bb></bb>
  </div>
</template>

<script setup lang="ts">
import bb from "./b.vue";
import { ref, watch, toRefs } from "vue";

const props = defineProps({
  data: String,
  arr: Array,
});

const { data, arr } = toRefs(props);
// console.log(data, arr);
watch(
  () => props.arr,
  (val) => {
    if (Array.isArray(val) && val) {
      console.log("a watch arr", val);
    }
  }
);
</script>

<style lang="scss">
div.d {
  width: 100px;
  line-height: 40px;
  background: chocolate;
  color: white;
  margin-bottom: 10px;
}
</style>
