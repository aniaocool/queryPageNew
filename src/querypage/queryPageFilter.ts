export default{
  detailFilter(value:any){
    return value
  },
  detailButtonFilter(row:any){
    if(row) return true
  },
  detailButtonFilter4(row:any){
    // if(row.status!=1){
    //   return false
    // }else{
    //   return true
    // }
    if(row) return true
  },
  typeFilter(value:any){
    if(value==1){
      return '类型1'
    }else{
      return '类型2'
    }
  },
  statusFilter(value:any){
    if(value==1){
      return '正常'
    }else{
      return '失败'
    }
  }
}