
export default{
  testCtrl:{
    goDetail1:(row:any,index:any,typeIndex:any,$refs:any,component:any)=>{
      console.log('detail1')
      component.value = 'testCtrl'
      setTimeout(()=>{
        if($refs.testCtrl){
          $refs.testCtrl.dialogShow = true
        }
      },0)
    },
    goDetail2(row:any,index:any,typeIndex:any,$refs:any,component:any){
      console.log('detail2')
      component.value = 'testCtrl2'
      setTimeout(()=>{
        if($refs.testCtrl2){
          $refs.testCtrl2.dialogShow = true
        }
      },0)
    },
    goDetail3:(row:any,index:any,typeIndex:any)=>{
      console.log('detail3',row,index,typeIndex)
    },
    see:()=>{
      console.log('see')
    }
  }
}