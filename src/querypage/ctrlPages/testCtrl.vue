<template>
  <div>
    <el-dialog width="60%" title="detail1" v-model="dialogShow">
      <p>1</p>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "testCtrl",
  data() {
    return {
      dialogShow: false,
    };
  },
});
</script>
