src/
├── 📁 api/                      # API Infrastructure
│   ├── axiosInstance.ts         # Axios setup + interceptors
│   └── apiConfig.ts             # ⭐ ADD: Base URLs, endpoints
│
├── 📁 assets/                   # Static Files
│   ├── 📁 images/               # Logos, backgrounds
│   ├── 📁 icons/                # SVG icons
│   └── 📁 fonts/                # ⭐ ADD: Custom fonts (if any)
│
├── 📁 components/               # Shared/Generic Components
│   ├── 📁 ui/                   # "Dumb" components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.css
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Spinner/
│   │   └── Card/
│   │
│   └── 📁 layout/               # App skeleton
│       ├── MainLayout/
│       │   ├── MainLayout.tsx
│       │   ├── MainLayout.css
│       │   ├── Header.tsx       # Navigation, user menu
│       │   ├── Footer.tsx
│       │   └── Sidebar.tsx
│       └── CartLayout/          # Special layout for cart pages
│
├── 📁 features/                 # ⭐ CORE: Business Logic by Domain
│   │
│   ├── 📁 auth/                 # Authentication & Authorization
│   │   ├── 📁 api/
│   │   │   └── authApi.ts       # login, register, logout, getMe
│   │   ├── 📁 components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useAuth.ts       # Auth state, login/logout logic
│   │   │   └── useAuthRedirect.ts # Redirect after login
│   │   ├── 📁 types/
│   │   │   └── auth.types.ts
│   │   └── index.ts             # Public API
│   │
│   ├── 📁 products/             # Product Catalog
│   │   ├── 📁 api/
│   │   │   └── productApi.ts    # getProducts, getProductById
│   │   ├── 📁 components/
│   │   │   ├── ProductCard/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   └── ProductCard.css
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── ProductDetails.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useProducts.ts   # Fetch, filter, search
│   │   │   └── useProductDetails.ts
│   │   ├── 📁 types/
│   │   │   └── product.types.ts
│   │   └── index.ts
│   │
│   ├── 📁 cart/                 # Shopping Cart
│   │   ├── 📁 api/
│   │   │   └── cartApi.ts       # Optional: sync cart with server
│   │   ├── 📁 components/
│   │   │   ├── CartItem/
│   │   │   ├── CartDrawer.tsx   # Slide-in cart
│   │   │   ├── CartSummary.tsx
│   │   │   └── EmptyCart.tsx
│   │   ├── 📁 hooks/
│   │   │   └── useCart.ts       # Add, remove, update quantity
│   │   ├── 📁 types/
│   │   │   └── cart.types.ts
│   │   └── index.ts
│   │
│   ├── 📁 orders/               # ⭐ ADD: Order Management
│   │   ├── 📁 api/
│   │   │   └── orderApi.ts      # createOrder, getOrders, getOrderById
│   │   ├── 📁 components/
│   │   │   ├── OrderCard/
│   │   │   ├── OrderHistory.tsx
│   │   │   ├── OrderDetails.tsx
│   │   │   ├── OrderStatus.tsx  # Status badge (pending, paid, shipped)
│   │   │   └── CheckoutForm.tsx # Address, payment method
│   │   ├── 📁 hooks/
│   │   │   ├── useOrders.ts     # Fetch user orders
│   │   │   └── useCheckout.ts   # Handle checkout process
│   │   ├── 📁 types/
│   │   │   └── order.types.ts
│   │   └── index.ts
│   │
│   └── 📁 admin/                # ⭐ ADD: Admin Panel         🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧
│       ├── 📁 api/
│       │   └── adminApi.ts      # CRUD for products, users, orders
│       ├── 📁 components/
│       │   ├── ProductManager/  # Create/edit/delete products
│       │   │   ├── ProductForm.tsx
│       │   │   ├── ProductTable.tsx
│       │   │   └── ImageUpload.tsx
│       │   ├── OrderManager/    # View/update all orders
│       │   │   ├── OrderTable.tsx
│       │   │   └── OrderStatusUpdate.tsx
│       │   ├── UserManager/     # View/update user roles
│       │   │   ├── UserTable.tsx
│       │   │   └── RoleSelector.tsx
│       │   └── Dashboard/       # Stats overview
│       │       ├── StatsCard.tsx
│       │       └── RecentOrders.tsx
│       ├── 📁 hooks/
│       │   ├── useAdminProducts.ts
│       │   ├── useAdminOrders.ts
│       │   └── useAdminUsers.ts
│       └── index.ts
│
├── 📁 pages/                    # ⭐ Pages: Compose features together
│   ├── Home.tsx                 # Landing page (ProductList + Layout)
│   ├── Login.tsx                # Auth/LoginForm
│   ├── Register.tsx             # Auth/RegisterForm
│   ├── ProductDetails.tsx       # Single product view
│   ├── Cart.tsx                 # Cart/CartDrawer full page
│   ├── Checkout.tsx             # Orders/CheckoutForm
│   ├── OrderHistory.tsx         # Orders/OrderHistory
│   ├── OrderDetails.tsx         # Orders/OrderDetails/:id
│   ├── Profile.tsx              # User profile
│   ├── NotFound.tsx             # 404 page
│   │
│   └── 📁 Admin/                # Admin pages
│       ├── Dashboard.tsx        # Admin/Dashboard
│       ├── ProductManagement.tsx # Admin/ProductManager
│       ├── OrderManagement.tsx  # Admin/OrderManager
│       └── UserManagement.tsx   # Admin/UserManager
│
├── 📁 routes/                   # Navigation & Route Protection
│   ├── AppRoutes.tsx            # All route definitions
│   ├── ProtectedRoute.tsx       # Auth required
│   ├── AdminRoute.tsx           # ⭐ ADD: Admin role required
│   └── GuestRoute.tsx           # ⭐ ADD: Redirect if logged in
│
├── 📁 store/                    # Global State Management (Zustand)
│   ├── authStore.ts             # ⭐ ADD: User, token, isAuthenticated
│   ├── cartStore.ts             # Cart items, total, count
│   └── uiStore.ts               # ⭐ ADD: Loading, notifications, modals
│
├── 📁 services/                 # ⭐ ADD: Business Services
│   ├── authService.ts           # Token storage, logout logic
│   ├── storageService.ts        # LocalStorage wrapper
│   ├── notificationService.ts   # Toast notifications
│   └── validationService.ts     # Form validation helpers
│
├── 📁 hooks/                    # ⭐ ADD: Shared Custom Hooks
│   ├── useLocalStorage.ts       # Generic localStorage hook
│   ├── useDebounce.ts           # Debounce search input
│   ├── useMediaQuery.ts         # Responsive breakpoints
│   ├── useToast.ts              # Toast notification hook
│   └── usePagination.ts         # Pagination logic
│
├── 📁 utils/                    # Utility Functions
│   ├── formatters.ts            # formatPrice, formatDate
│   ├── validators.ts            # Email, password validation
│   ├── constants.ts             # API URLs, localStorage keys
│   └── helpers.ts               # Generic helper functions
│
├── 📁 models/                   # ⭐ EXPAND: TypeScript Types/Interfaces
│   ├── user.model.ts            # User, UserRole
│   ├── product.model.ts         # Product, Category
│   ├── order.model.ts           # ⭐ ADD: Order, OrderItem, OrderStatus
│   ├── cart.model.ts            # ⭐ ADD: CartItem, Cart
│   ├── api.model.ts             # ⭐ ADD: ApiResponse, ApiError
│   └── common.model.ts          # ⭐ ADD: Pagination, Filter
│
├── 📁 styles/                   # ⭐ OPTIONAL: Global Styles
│   ├── variables.css            # CSS custom properties (colors, spacing)
│   ├── mixins.css               # Reusable CSS patterns
│   └── reset.css                # CSS reset
│
├── 📁 config/                   # ⭐ ADD: Configuration Files
│   ├── env.ts                   # Environment variables
│   └── roles.ts                 # Role constants (ADMIN, MANAGER, CUSTOMER)
│
├── 📁 __tests__/                # ⭐ RECOMMENDED: Tests
│   ├── 📁 features/
│   │   ├── auth.test.tsx
│   │   ├── cart.test.tsx
│   │   └── products.test.tsx
│   ├── 📁 hooks/
│   │   └── useAuth.test.ts
│   └── 📁 utils/
│       └── formatters.test.ts
│
├── App.tsx                      # Root component (Providers, Router)
├── main.tsx                     # Entry point
├── index.css                    # Global styles
├── vite-env.d.ts                # Vite types
└── setupTests.ts                # ⭐ ADD: Test setup (if using tests)













src/
├── 📁 api/                      # הגדרות תשתית לתקשורת (לא לוגיקה עסקית)
│   └── axiosInstance.ts         # יצירת המופע המרכזי של Axios והגדרת Interceptors
│
├── 📁 assets/                   # קבצים סטטיים
│   ├── 📁 images/               # לוגו של הסופר, תמונות רקע
│   └── 📁 icons/                # אייקונים של עגלה, משתמש וכו'
│
├── 📁 components/               # רכיבים גנריים (Shared/UI)
│   ├── 📁 ui/                   # רכיבים "טיפשים" (Button, Input, Spinner, Modal)
│   └── 📁 layout/               # שלד האפליקציה
│       ├── 📁 MainLayout/       # קובץ .tsx ו-.css של הלייאאוט הראשי
│       └── 📁 CartLayout/       # לייאאוט ייעודי לדפי עגלה/צ'ק-אאוט
│
├── 📁 features/                 # הליבה של האפליקציה (לוגיקה לפי נושאים)
│   ├── 📁 auth/                 # התחברות והרשמה
│   │   ├── 📁 api/              # authApi.ts
│   │   ├── 📁 components/       # LoginForm, RegisterForm
│   │   ├── 📁 hooks/            # useAuth (ניהול טוקנים וכניסה)
│   │   └── index.ts             # ה-Public API של הפיצ'ר
│   │
│   ├── 📁 products/             # קטלוג המוצרים
│   │   ├── 📁 api/              # productApi.ts (שליפת מוצרים)
│   │   ├── 📁 components/       # ProductCard, CategoryFilter
│   │   ├── 📁 hooks/            # useProducts (לוגיקת סינון וחיפוש)
│   │   └── index.ts
│   │
│   └── 📁 cart/                 # ניהול עגלת הקניות
│       ├── 📁 api/              # cartApi.ts (שמירת עגלה בשרת)
│       ├── 📁 components/       # CartItem, CartDrawer
│       ├── 📁 hooks/            # useCart (הוספה/הסרה/חישוב סכום)
│       └── index.ts
│
├── 📁 pages/                    # דפים שלמים (מרכיבים Features יחד)
│   ├── 📁 Admin/                # Dashboard.tsx
│   ├── Home.tsx                 # דף הבית (משלב Products + Layout)
│   ├── Login.tsx                # דף התחברות (משלב Auth)
│   ├── ProductDetails.tsx       # דף מוצר ספציפי
│   └── Checkout.tsx             # דף תשלום סופי
│
├── 📁 routes/                   # ניהול הניווט
│   ├── AppRoutes.tsx            # הגדרת כל ה-Routes
│   └── ProtectedRoute.tsx       # הגנה על דפי אדמין/משתמש רשום
│
├── 📁 store/                    # ניהול State גלובלי (Zustand/Redux)
│   └── cartStore.ts             # ניהול מצב העגלה חוצה-אפליקציה
│
├── 📁 utils/                    # פונקציות עזר
│   ├── formatters.ts            # עיצוב מחירים (ש"ח) ותאריכים
│   └── constants.ts             # כתובות API, מפתחות ב-LocalStorage
│
├── 📁 models/                   # Interfaces ו-Types של TypeScript
│   ├── product.model.ts
│   └── user.model.ts
│
├── App.tsx                      # עטיפת האפליקציה ב-Providers (Router, State)
├── main.tsx                     # נקודת הכניסה (Entry Point)
└── index.css                    # הגדרות עיצוב גלובליות