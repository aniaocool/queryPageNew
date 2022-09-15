


import testCtrl from './ctrlPages/testCtrl.vue'
import testCtrl2 from './ctrlPages/testCtrl2.vue'

export default {
  install(app:any) {
    app.component('testCtrl',testCtrl)
      .component('testCtrl2',testCtrl2)
  }
}

