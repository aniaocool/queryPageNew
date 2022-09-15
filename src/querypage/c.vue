<template>
  <el-row class="condition-wrap clear-both">
    <!-- 左侧查询条件 -->
    <el-col :span="20">
      <el-form
        label-width="140px"
        class="query-search-form"
        ref="queryForm"
        label-suffix="："
        :model="queryParamCon"
        status-icon
      >
        <el-row>
          <el-col
            :md="12"
            :lg="8"
            :xl="7"
            v-for="(item, index) in conditionData"
            v-show="!conditionShow ? index < 6 : true"
            :key="index"
          >
            <!-- 输入框 -->
            <el-form-item
              v-if="item.controlType === 'Input'"
              :label="item.chineseName"
              :prop="item.fieldName"
            >
              <el-input
                class="query-search-input"
                v-model="queryParamCon[item.fieldName]"
                :placeholder="item.placeholder"
              ></el-input>
            </el-form-item>
            <!-- 选择框 -->
            <el-form-item
              v-if="item.controlType === 'Select'"
              :label="item.chineseName"
              :prop="item.fieldName"
            >
              <el-select
                class="query-search-input"
                v-model="queryParamCon[item.fieldName]"
              >
                <el-option value label="全部"></el-option>
                <el-option
                  v-for="option in item.controlData"
                  :key="option[item.valueProperty]"
                  :label="option[item.displayProperty]"
                  :value="option[item.valueProperty]"
                  :placeholder="item.placeholderName"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 多选框 -->
            <el-form-item
              v-if="item.controlType === 'MulSelect'"
              :label="item.chineseName"
              :prop="item.fieldName"
            >
              <el-select
                class="query-search-input"
                v-model="queryParamCon[item.fieldName]"
                placeholder="全部"
                multiple
              >
                <el-option
                  v-for="option in item.controlData"
                  :key="option[item.valueProperty]"
                  :label="option[item.displayProperty]"
                  :value="option[item.valueProperty]"
                  :placeholder="item.placeholderName"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 日期范围时间框 -->
            <el-form-item
              v-if="item.controlType === 'DateRange'"
              :label="item.chineseName"
              :prop="item.fieldName"
            >
              <el-date-picker
                unlink-panels
                type="daterange"
                value-format="YYYY-MM-DD"
                start-placeholder="开始日期"
                end-placeholder="结束如期"
                class="query-search-input"
                v-model="queryParamCon[item.fieldName]"
              ></el-date-picker>
            </el-form-item>
            <!-- 日期框 -->
            <el-form-item
              v-if="item.controlType === 'Date'"
              :label="item.chineseName"
              :prop="item.fieldName"
            >
              <el-date-picker
                unlink-panels
                type="date"
                value-format="yyyy-MM-dd"
                class="query-search-input"
                v-model="queryParamCon[item.fieldName]"
                :placeholder="item.placeholder"
              ></el-date-picker>
            </el-form-item>
            <!-- 需要则继续添加 -->
          </el-col>
        </el-row>
      </el-form>
    </el-col>
    <!-- 右侧查询按钮 -->
    <el-col :span="4" style="min-width: 185px">
      <el-row type="flex" justify="end" align="top">
        <div class="btn-group clear-both">
          <el-link
            style="margin: 10px"
            type="primary"
            v-show="conditionData.length > 6"
            :underline="false"
            :icon="conditionShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="conditionShow = !conditionShow"
            >{{ conditionShow ? "收起" : "展开" }}</el-link
          >
          <el-button @click="resetData(queryForm)">重置</el-button>
          <el-button type="primary">查询</el-button>
        </div>
      </el-row>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, watch, toRefs, reactive } from "vue";
let conditionShow = ref(false);
let queryParamCon = reactive({});
let conditionData = ref([]);
const props = defineProps({
  conditionDataArray: Array,
});

watch(
  () => props.conditionDataArray,
  (val) => {
    if (Array.isArray(val) && val) {
      conditionData.value = val;
    }
  }
);
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
