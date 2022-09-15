<template>
  <!-- v-if="Array.isArray(conditionData) && conditionData.length" -->
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
                @keyup.enter="queryData(false, true)"
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
          <el-button
            type="primary"
            @click="queryData(false, true)"
            @keyup.enter="queryData(false, true)"
            >查询</el-button
          >
        </div>
      </el-row>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { watch, ref, reactive } from "vue";
import type { FormInstance } from "element-plus";
import { useRoute } from "vue-router";

interface queryCon {
  [prop: string]: any;
}

//init参数
const route = useRoute();
const queryForm = ref<FormInstance>();
let queryParamCon: queryCon = reactive({});
let conditionData = ref([]);
let conditionShow = ref(false);
let initParam = ref(false);

//初始化emit
const emit = defineEmits(["queryData"]);
//初始化prop
const props = defineProps({
  conditionColumns: Array,
});

//监听conditionColumns数据
watch(
  () => props.conditionColumns,
  (val) => {
    if (Array.isArray(val) && val) {
      console.log("watch", val);
      initConditionData(val);
    }
  }
);

//表头配置项生成
function initConditionData(data) {
  conditionData.value = data;
  initConditionList(data);
}

//表头表单queryParamCon生成
function initConditionList(data) {
  data.forEach((item) => {
    queryParamCon[item.fieldName] = item.defaultValue ? item.defaultValue : "";

    if (item.controlType === "Select" || item.controlType === "MulSelect") {
      //选项处理
      if (item.controlData) {
        if (Array.isArray(item.controlData)) {
          console.log("isarray");
        } else if (typeof item.controlData === "string") {
          try {
            item.controlData = JSON.parse(item.controlData);
          } catch (e) {
            console.log("error", e);
          }
        }
      } else {
        //未返回数据请求接口
        if (item.controlDataUrl) {
          //举例
          this.$axios
            .get(item.controlDataUrl, { $LoadingMsg: "" })
            .then((res) => {
              let options = res.data.data;
              if (options) {
                if (Array.isArray(options) && options.length) {
                  item.controlData = options;
                }
              }
            });
        }
      }
    } else if (item.controlType === "DateRange") {
      queryParamCon[item.fieldName] = item.defaultValue
        ? JSON.parse(item.defaultValue)
        : [];
    }
  });
  //请求数据
  queryData();
}

//格式化param
const formatQueryParamCon = () => {
  let params = {};
  for (let item in queryParamCon) {
    if (typeof queryParamCon[item] == "string") {
      params[item] = queryParamCon[item].trim();
    } else {
      params[item] = queryParamCon[item];
    }
  }
  return params;
};

//session处理
const handleSession = () => {
  //获取session数据
  if (!initParam.value) {
    let sessionparamstr = sessionStorage.getItem(
      route.params.pagekey + "-params"
    );
    if (sessionparamstr) {
      let sessionparams = JSON.parse(sessionparamstr);
      Object.keys(sessionparams).forEach((key) => {
        if (!queryParamCon[key]) {
          queryParamCon[key] = "";
        }
        queryParamCon[key] = sessionparams[key];
      });
    }
    initParam.value = true;
  }

  //保存session数据
  if (Object.keys(queryParamCon).length) {
    let storgeParam = {};
    Object.keys(queryParamCon).forEach((key) => {
      storgeParam[key] = queryParamCon[key];
    });
    sessionStorage.setItem(
      route.params.pagekey + "-params",
      JSON.stringify(storgeParam)
    );
  }
};

const queryData = (isReset?: boolean, isHandleSearch?: boolean) => {
  handleSession();
  let params = formatQueryParamCon();
  emit("queryData", params, isReset, isHandleSearch);
};
const getQuery = () => {
  return formatQueryParamCon();
};
const resetData = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  queryData(true);
};

//暴露方法
defineExpose({ getQuery });
</script>
<style lang="scss">
.condition-wrap {
  display: flex;
  .el-col {
    margin-bottom: 15px;
  }
  .query-search-form {
    .query-search-input {
      width: 100%;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .btn-group {
    text-align: right;
    padding-bottom: 9px;
  }
}
</style>
