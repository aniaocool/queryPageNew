export default{
  detailFilter(value){
    return value
  },
  detailButtonFilter(row){
    if(row) return true
  },
  detailButtonFilter4(row){
    // if(row.status!=1){
    //   return false
    // }else{
    //   return true
    // }
    if(row) return true
  },
  typeFilter(value){
    if(value==1){
      return '类型1'
    }else{
      return '类型2'
    }
  },
  statusFilter(value){
    if(value==1){
      return '正常'
    }else{
      return '失败'
    }
  }
}