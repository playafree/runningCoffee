const MainRoutes = [
  {
    path: '/home',
    alias: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/Menu.vue')
  },
  {
    path: '/shopbag',
    name: 'Shopbag',
    component: () => import('../views/Shopbag.vue')
  },
  {
    path: '/my',
    name: 'My',
    component: () => import('../views/My.vue')
  }
]



export const routes = [
    {
      path: '/',
      name: 'Main',
      component: () => import('../views/Main.vue'),
      children: MainRoutes
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/product/:pid',
      name: 'Product',
      component: () => import('../views/Product.vue')
    },
    {
      path: '/order',
      name: 'Order',
      component: () => import('../views/Order.vue')
    },
    {
      path: '/address',
      name: 'Address',
      component: () => import('../views/Address.vue')
    },
    {
      path: '/editAddr/:aid?',
      name: 'EditAddr',
      component: () => import('../views/EditAddr.vue')
    },
    {
      path: '/message',
      name: 'Message',
      component: () => import('../views/Message.vue')
    },
    {
      path: '/myOrder',
      name: 'MyOrder',
      component: () => import('../views/MyOrder.vue')
    },
    {
      path: '/collect',
      name: 'Collect',
      component: () => import('../views/Collect.vue')
    },
    {
      path: '/saveCenter',
      name: 'SaveCenter',
      component: () => import('../views/SaveCenter.vue')
    },
    {
      path: '/searchList',
      name: 'SearchList',
      component: () => import('../views/SearchList.vue')
    }
  ]