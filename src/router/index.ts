import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path:'/',
    redirect: '/index'
  },
  {
    path:'/index',
    name:"index",
    component: () =>
          import(/* webpackChunkName: "about" */ "../views/index.vue"),
  },
  {
    path: "/queryPage",
    name: "queryPage",
    component: () =>
          import(/* webpackChunkName: "about" */ "../views/index.vue"),
    children:[
      {
        path:'/queryPage/:pagekey',
        name:'查询',
        meta:{
          keepAlive:true
        },
        //component: querypage
        component: () =>
          import(/* webpackChunkName: "about" */ "../querypage/queryPage.vue"),

      },
      // {
      //   path:'/queryConfig/edit/:pagekey',
      //   component: () =>
      //     import(/* webpackChunkName: "about" */ "../views/queryPageConfig.vue"),
      // }
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
