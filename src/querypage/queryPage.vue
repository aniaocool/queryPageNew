<template>
  <el-card>
    <!-- 头部查询配置 -->
    <queryCondition
      :conditionColumns="conditionColumns"
      ref="queryHead"
      @queryData="queryData"
    ></queryCondition>
    <!-- 头部按钮配置 -->
    <div
      class="query-operation is-right"
      v-show="Array.isArray(operBtn) && operBtn.length"
    >
      <el-button
        v-for="(item, index) in operBtn"
        :icon="btnIcon(item)"
        @click="btnfunc(item)"
        :key="index"
        >{{ item.name }}</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table
      v-if="showTable"
      max-height="800"
      border
      ref="table"
      :data="tableData"
      v-loading="loading"
      @selection-change="handleSelectChange"
      @sort-change="handleSortChange"
    >
      <!-- 选择列 -->
      <el-table-column
        fixed
        v-if="hasCheckbox"
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <!-- 序号列 -->
      <el-table-column
        fixed
        type="index"
        width="80"
        align="center"
        :show-overflow-tooltip="true"
        :resizable="false"
        :index="indexMethod"
        label="序号"
      ></el-table-column>
      <!-- 数据列 -->
      <el-table-column
        v-for="(item, index) in tableColumns"
        :key="index"
        :label="item.label"
        :align="item.align"
        :sortable="item.sortable"
        :prop="item.prop"
        :width="item.width"
        :min-width="item.minWidth"
        header-align="center"
        resizable
        show-overflow-tooltip
        :fixed="handlerFixed(item.columnLock)"
      >
        <template #default="scope">
          <el-button
            link
            v-show="item.funName"
            @click="linkJump(item.funName, scope.row)"
          >
            {{ tableColumnFilter(scope.row[item.prop], item, scope.row) }}
          </el-button>
          <span v-show="!item.funName">
            <span>
              {{ tableColumnFilter(scope.row[item.prop], item, scope.row) }}
            </span>
          </span>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        fixed="right"
        :label="templateColumnData.chineseName"
        :width="templateColumnData.width"
        align="center"
        v-if="operColumn && operColumn.length > 0"
      >
        <template #default="scope">
          <span v-for="(item, index) in btnFilter(scope.row)" :key="index">
            <el-button
              link
              class="btnshow"
              @click="operColumnFunc(scope.$index, scope.row, index)"
              >{{ item.text }}</el-button
            >
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="showTable"
      class="query-page-pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :currentPage="pageNo"
      :page-size="pageSize"
      :page-sizes="[5, 10, 15, 20, 30]"
      layout="total,sizes,prev,pager,next,jumper"
      :total="totalRecord"
    />
    <!-- 动态弹窗 -->
    <component :is="componentsData" :ref="componentsData"></component>
  </el-card>
</template>

<script lang="ts" setup>
import queryCondition from "./queryCondition.vue";
import queryPageCtrl from "./queryPageCtrl";
import queryPageFilter from "./queryPageFilter.js";

import { ref, onMounted, getCurrentInstance, nextTick, reactive } from "vue";
import { CirclePlus, Download, Upload } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import axios from "axios";

//pageKey
const route = useRoute();
let pageKey = ref(route.params.pagekey);

//获取当前组件实例，获取$refs用
const vm: any = getCurrentInstance();

//mounted
onMounted(() => {
  initTableConfig();
});

/***
 *
 * 各项配置初始化
 *
 */
let pageController: any = ref(""); //控制器名
let conditionColumns: any = ref([]); //头部查询配置
let operBtn: any = ref([]); //头部按钮配置
let tableColumns: any = reactive([]); //表格表头列
let templateColumnData: any = ref({}); //操作列配置
let operColumn: any = ref([]); //操作列按钮
let hasCheckbox = ref(false);
let queryParams = ref({}); //表单数据model

const initTableConfig = () => {
  axios.get("/api/queryPage/" + route.params.pagekey).then((res) => {
    let queryConfig = res.data.queryConfig;
    pageController.value = queryConfig.controller;
    conditionColumns.value = queryConfig.conditionColumns;
    operBtn.value = queryConfig.buttons;
    queryConfig.gridColumns.forEach((item: any) => {
      let item_align = "center";
      if (item.alignMode === 0) {
        item_align = "left";
      } else if (item.alignMode === 2) {
        item_align = "right";
      }
      tableColumns.push({
        prop: item.fieldName,
        label: item.chineseName,
        width: item.width,
        funName: item.funName,
        styleFilterName: item.styleFilterName,
        valueFilterName: item.valueFilterName,
        sortable: item.isTitle !== 0,
        align: item_align,
        columnLock: item.columnLock,
      });
    });
    //表格操作列
    if (
      Array.isArray(queryConfig.templateColumns) &&
      queryConfig.templateColumns.length
    ) {
      let templates: any = [],
        htmlElements: any = [],
        operateData: any;
      queryConfig.templateColumns.forEach((item: any) => {
        if (item.type === "2") {
          hasCheckbox.value = true;
        }
        // 计算宽度
        let itemWidth = "";
        operateData = item;
        operateData.width = itemWidth;
      });
      //操作列按钮
      if (operateData) {
        htmlElements = JSON.parse(operateData.htmlContent);
        templateColumnData.value = operateData;
      }
      if (Array.isArray(htmlElements) && htmlElements.length) {
        htmlElements.forEach((item) => {
          //暂不靠考虑权限控制authCode
          templates.push(item);
        });
        operColumn.value = templates;
      }
    }
  });
};
//固定列
const handlerFixed = (val: any) => {
  let data: any = false;
  if (val == 1) {
    data = true;
  }
  if (val == 2) {
    data = "right";
  }
  return data;
};

/**
 *
 * 查询相关
 *
 */
//查询数据参数
const queryData = (params: any, isReset: boolean, isHandleSearch: boolean) => {
  //重置或手动搜索 设置页码为1
  if (isReset || isHandleSearch) {
    sessionStorage.setItem(route.params.pagekey + "-pageno", "1");
  }
  let queryParams = {
    pageNo: isReset
      ? 1
      : sessionStorage.getItem(route.params.pagekey + "-pageno") || 1,
    pageSize: pageSize.value,
    ...params,
  };
  getTableData(queryParams);
};
//查询数据
let loading = ref(false);
let showTable = ref(false);
let tableData = ref([]);

const getTableData = (queryParams: any) => {
  loading.value = true;
  axios.post("/api/queryTableData", queryParams).then((res) => {
    showTable.value = true;
    tableData.value = res.data.data.list;
    loading.value = false;
  });
};

/***
 *
 * 头部按钮相关
 *
 */
//头部按钮图标
const btnIcon = (item: any) => {
  let iconClass;
  if (item.name.indexOf("导入") > -1) {
    iconClass = Upload;
  } else if (item.name.indexOf("导出") > -1) {
    iconClass = Download;
  } else if (item.name.indexOf("新建") > -1) {
    iconClass = CirclePlus;
  }
  return iconClass;
};
//头部按钮函数
const btnfunc = (btn: any) => {
  if (btn.funName) {
    //checkbox
    if (btn.needCheckbox == 1) {
      (queryPageCtrl as any)[pageController.value][btn.funName].call(
        this,
        selectRows
      );
    }
    //导出公共函数，示例
    else if (btn.funName == "export") {
      let tag = vm.ctx.$refs.queryHead.getQuery();
      let url = `api/export/${route.params.pagekey}`;
      axios({
        url: url,
        method: "post",
        data: tag,
        responseType: "arraybuffer",
      }).then((res) => {
        if (res) {
          let headers = res.headers;
          let content = headers["content-disposition"];
          let fileName = decodeURI(content.split(";")[1].split("fileName=")[1]);
          let blob = new Blob([res.data], {
            type: res.headers["content-type"],
          });
          let downloadElement = document.createElement("a");
          let href = URL.createObjectURL(blob);
          downloadElement.href = href;
          downloadElement.download = fileName;
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          //释放掉blob对象
          URL.revokeObjectURL(href);
        }
      });
    } else {
      let funNameReg = /^([a-zA-Z_]|\$)([\w$]*)$/;
      if (funNameReg.test(btn.funName)) {
        (queryPageCtrl as any)[pageController.value][btn.funName].call(this);
      }
    }
  }
};

/***
 *
 * 表格方法
 *
 */
let selectRows = ref([]);
//选择
const handleSelectChange = (val: any) => {
  selectRows.value = val;
};
//排序
const handleSortChange = () => {
  console.log("handleSortChange");
};

/**
 *
 * queryPageFilter过滤器
 *
 */
const tableColumnFilter = (value: any, item: any, row: any) => {
  let filterValue = null;
  if (item.valueFilterName && (queryPageFilter as any)[item.valueFilterName]) {
    filterValue = (queryPageFilter as any)[item.valueFilterName](
      value,
      item,
      row
    );
  } else {
    filterValue = value;
  }
  return filterValue;
};

/***
 *
 * 按钮相关
 *
 */
//按钮过滤
const handleButtonShow = (row: any) => {
  let list: any = [];
  operColumn.value.forEach((item: any) => {
    if (item.filterName && (queryPageFilter as any)[item.filterName]) {
      //return true按钮显示
      if ((queryPageFilter as any)[item.filterName](row)) {
        list.push(item);
      }
    } else {
      list.push(item);
    }
  });
  return list;
};
//按钮
const btnFilter = (row: any) => {
  return handleButtonShow(row);
};
//一般为链接跳转用
const linkJump = (funName: string, row: any) => {
  (queryPageCtrl as any)[pageController.value][funName](row);
};

/**
 *
 * 操作栏 操作函数
 *
 */
let componentsData = ref("");

const operColumnFunc = (index: any, row: any, typeIndex: any) => {
  (queryPageCtrl as any)[pageController.value][
    btnFilter(row)[typeIndex].funName
  ].call(this, row, index, typeIndex, vm.ctx.$refs, componentsData);
  //componentsData.value = "testCtrl2";
};

/***
 *
 * 分页相关
 *
 */
let pageNo = ref(1);
let pageSize = ref(10);
let totalRecord = ref(0);
const handleSizeChange = (val: any) => {
  pageSize.value = val;
  let queryParams = {
    pageSize: val,
    pageNo: pageNo.value,
  };
  getTableData(queryParams);
  sessionStorage.setItem(pageKey.value + "-pagesize", val);
};
const handleCurrentChange = (val: any) => {
  pageNo.value = val;
  let queryParams = {
    pageSize: pageSize.value,
    pageNo: val,
  };
  getTableData(queryParams);
  sessionStorage.setItem(pageKey.value + "-pageno", val);
};
//分页序号展示
const indexMethod = (index: any) => {
  return (pageNo.value - 1) * pageSize.value + index + 1;
};
</script>

<style lang="scss" scope>
.btnshow {
  margin: 0 5px;
}
.hidebtnwrap {
  display: block;
  text-align: center;
}
.btnhide {
  margin: 5px 0;
}
.query-page-pagination {
  margin: 20px 0 0 0;
  justify-content: end;
}

.query-operation {
  border: 1px solid #ebeef5;
  border-bottom: 0;
  padding: 10px;
  background: #fbfbfb;
  text-align: left;
  font-size: 0;
  .el-button {
    padding: 10px;
    + .el-button {
      margin-left: 20px;
    }
  }
}
</style>
