import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/stock',
      name: 'My Stock',
      component: () => import('../views/StockView.vue')
    },
    {
      path: '/production',
      name: 'Production',
      component: () => import('../views/ProductionView.vue')
    },
    {
      path: '/branchs',
      name: 'Our Branches',
      component: () => import('../views/BranchView.vue')
    },
    {
      path: '/order',
      children: [
        {
          name: 'Order',
          path: '',
          component: () => import('../views/OrderView.vue')
        }
      ]
    },
    {
      path: '/bills',
      children: [
        {
          name: 'Bills',
          path: '',
          component: () => import('../views/BillView.vue')
        },
        {
          name: 'Bills Confirm',
          path: 'confirm/:orderId',
          component: () => import('../views/BillConfirmView.vue')
        },
        {
          name: 'Bills Detail',
          path: 'detail/:orderId',
          component: () => import('../views/BillDetailView.vue')
        }
      ]
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/edit-profile',
      name: 'Edit Profile',
      component: () => import('../views/EditProfile.vue')
    },
    {
      path: '/:chapters*',
      redirect: { name: 'My Stock' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const auth = useAuthStore()

  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath
    next({ name: 'Login' })
  }
  next()
})

export default router
