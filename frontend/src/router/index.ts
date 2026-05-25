import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// ── Lazy-loaded page components ───────────────────────────────
// Public
const HomePage           = () => import('@/pages/HomePage.vue')
const TemplateListPage   = () => import('@/pages/TemplateListPage.vue')
const TemplateDetailPage = () => import('@/pages/TemplateDetailPage.vue')
const PricingPage        = () => import('@/pages/PricingPage.vue')
const FaqPage            = () => import('@/pages/FaqPage.vue')
const PrivacyPage        = () => import('@/pages/PrivacyPage.vue')
const TermsPage          = () => import('@/pages/TermsPage.vue')

// Auth
const LoginPage          = () => import('@/pages/auth/LoginPage.vue')
const RegisterPage       = () => import('@/pages/auth/RegisterPage.vue')
const ForgotPasswordPage = () => import('@/pages/auth/ForgotPasswordPage.vue')

// Editor (heavy — separate chunk)
const EditorPage         = () => import('@/pages/EditorPage.vue')

// Checkout
const CheckoutPage       = () => import('@/pages/CheckoutPage.vue')
const OrderSuccessPage   = () => import('@/pages/OrderSuccessPage.vue')

// Dashboard
const DashboardPage      = () => import('@/pages/dashboard/DashboardPage.vue')
const OrdersPage         = () => import('@/pages/dashboard/OrdersPage.vue')
const DraftsPage         = () => import('@/pages/dashboard/DraftsPage.vue')

// Admin (separate lazy chunk)
const AdminDashboard     = () => import('@/pages/admin/AdminDashboard.vue')
const AdminOrders        = () => import('@/pages/admin/AdminOrders.vue')
const AdminOrderDetail   = () => import('@/pages/admin/AdminOrderDetail.vue')
const AdminTemplates     = () => import('@/pages/admin/AdminTemplates.vue')
const AdminRenderQueue   = () => import('@/pages/admin/AdminRenderQueue.vue')
const AdminUsers         = () => import('@/pages/admin/AdminUsers.vue')

// ── Route Definitions ─────────────────────────────────────────
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // ── Public ────────────────────────────────────────────────
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { title: 'Photobook — Sách ảnh kỷ niệm' }
    },
    {
      path: '/templates',
      name: 'templates',
      component: TemplateListPage,
      meta: { title: 'Khám phá mẫu thiết kế' }
    },
    {
      path: '/templates/:slug',
      name: 'template-detail',
      component: TemplateDetailPage,
      meta: { title: 'Chi tiết mẫu' }
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: PricingPage,
      meta: { title: 'Bảng giá' }
    },
    {
      path: '/faq',
      name: 'faq',
      component: FaqPage,
      meta: { title: 'Câu hỏi thường gặp' }
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyPage,
      meta: { title: 'Chính sách bảo mật' }
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsPage,
      meta: { title: 'Điều khoản dịch vụ' }
    },

    // ── Auth ──────────────────────────────────────────────────
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { title: 'Đăng nhập', guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { title: 'Đăng ký', guest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordPage,
      meta: { title: 'Quên mật khẩu', guest: true }
    },

    // ── Editor ────────────────────────────────────────────────
    {
      path: '/editor/new/:templateId',
      name: 'editor-new',
      component: EditorPage,
      meta: { title: 'Tạo photobook mới', requiresAuth: true, layout: 'editor' }
    },
    {
      path: '/editor/:projectId',
      name: 'editor',
      component: EditorPage,
      meta: { title: 'Chỉnh sửa photobook', requiresAuth: true, layout: 'editor' }
    },

    // ── Checkout ──────────────────────────────────────────────
    {
      path: '/checkout/:projectId',
      name: 'checkout',
      component: CheckoutPage,
      meta: { title: 'Thanh toán', requiresAuth: true }
    },
    {
      path: '/checkout/success/:orderId',
      name: 'order-success',
      component: OrderSuccessPage,
      meta: { title: 'Đặt hàng thành công', requiresAuth: true }
    },

    // ── User Dashboard ────────────────────────────────────────
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { title: 'Dự án của tôi', requiresAuth: true }
    },
    {
      path: '/dashboard/orders',
      name: 'orders',
      component: OrdersPage,
      meta: { title: 'Đơn hàng của tôi', requiresAuth: true }
    },
    {
      path: '/dashboard/drafts',
      name: 'drafts',
      component: DraftsPage,
      meta: { title: 'Bản nháp', requiresAuth: true }
    },

    // ── Admin ─────────────────────────────────────────────────
    {
      path: '/admin',
      redirect: '/admin/dashboard',
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { title: 'Admin — Tổng quan', requiresAuth: true, requiresAdmin: true, layout: 'admin' }
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: AdminOrders,
      meta: { title: 'Admin — Quản lý đơn hàng', requiresAuth: true, requiresAdmin: true, layout: 'admin' }
    },
    {
      path: '/admin/orders/:id',
      name: 'admin-order-detail',
      component: AdminOrderDetail,
      meta: { title: 'Admin — Chi tiết đơn', requiresAuth: true, requiresAdmin: true, layout: 'admin' }
    },
    {
      path: '/admin/templates',
      name: 'admin-templates',
      component: AdminTemplates,
      meta: { title: 'Admin — Quản lý template', requiresAuth: true, requiresAdmin: true, layout: 'admin' }
    },
    {
      path: '/admin/render-queue',
      name: 'admin-render-queue',
      component: AdminRenderQueue,
      meta: { title: 'Admin — Hàng đợi render', requiresAuth: true, requiresAdmin: true, layout: 'admin' }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: AdminUsers,
      meta: { title: 'Admin — Người dùng', requiresAuth: true, requiresAdmin: true, layout: 'admin' }
    },

    // ── 404 ───────────────────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
      meta: { title: 'Không tìm thấy trang' }
    },
  ],

  // Scroll to top on page change
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

// ── Navigation Guards ─────────────────────────────────────────
router.beforeEach(async (to) => {
  // Update document title
  document.title = `${to.meta.title || 'Photobook'}`

  const authStore = useAuthStore()

  // Initialize auth state on first navigation
  if (!authStore.initialized) {
    await authStore.init()
  }

  // Require authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Require admin role
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: 'home' }
  }

  // Redirect authenticated users away from guest-only pages
  if (to.meta.guest && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
