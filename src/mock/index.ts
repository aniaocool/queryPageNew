import mock from 'mockjs'
import { getUserList,results } from './query'

//模拟表格数据
mock.mock("/api/queryTableData", "post", getUserList);
//模拟查询框架配置数据
mock.mock(/\/api\/queryPage\/test.*/, "get", results);
export default mock