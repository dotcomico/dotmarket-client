📦src
 ┣ 📂api
 ┃ ┣ 📜apiConfig.ts
 ┃ ┗ 📜axiosInstance.ts
 ┣ 📂assets
 ┃ ┣ 📂fonts
 ┃ ┣ 📂icons
 ┃ ┗ 📂images
 ┣ 📂components
 ┃ ┣ 📂layouts
 ┃ ┃ ┣ 📂AppLayout
 ┃ ┃ ┃ ┣ 📂Fotter
 ┃ ┃ ┃ ┃ ┣ 📜Fotter.css
 ┃ ┃ ┃ ┃ ┗ 📜Fotter.tsx
 ┃ ┃ ┃ ┣ 📂Header
 ┃ ┃ ┃ ┃ ┣ 📜Header.css
 ┃ ┃ ┃ ┃ ┗ 📜Header.tsx
 ┃ ┃ ┃ ┣ 📂Sidebar
 ┃ ┃ ┃ ┃ ┣ 📜Sidebar.css
 ┃ ┃ ┃ ┃ ┗ 📜Sidebar.tsx
 ┃ ┃ ┃ ┣ 📜App.css
 ┃ ┃ ┃ ┗ 📜App.tsx
 ┃ ┃ ┗ 📂CartLayout
 ┃ ┃ ┃ ┣ 📜CartLayout.css
 ┃ ┃ ┃ ┗ 📜CartLayout.tsx
 ┃ ┗ 📂ui
 ┃ ┃ ┣ 📂Botton
 ┃ ┃ ┃ ┣ 📜Button.css
 ┃ ┃ ┃ ┗ 📜Button.tsx
 ┃ ┃ ┣ 📂Card
 ┃ ┃ ┃ ┣ 📜Card.css
 ┃ ┃ ┃ ┗ 📜Card.tsx
 ┃ ┃ ┣ 📂Input
 ┃ ┃ ┃ ┣ 📜Input.css
 ┃ ┃ ┃ ┗ 📜Input.tsx
 ┃ ┃ ┣ 📂SearchBar
 ┃ ┃ ┃ ┣ 📜SearchBar.css
 ┃ ┃ ┃ ┗ 📜SearchBar.tsx
 ┃ ┃ ┣ 📂Spinner
 ┃ ┃ ┃ ┣ 📜Spinner.css
 ┃ ┃ ┃ ┗ 📜Spinner.tsx
 ┃ ┃ ┗ 📂ThemeToggle
 ┃ ┃ ┃ ┣ 📜ThemeToggle.css
 ┃ ┃ ┃ ┗ 📜ThemeToggle.tsx
 ┣ 📂constants
 ┃ ┣ 📜config.ts
 ┃ ┗ 📜uiStrings.ts
 ┣ 📂features
 ┃ ┣ 📂admin
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┗ 📜adminApi.ts
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📂Dashboard
 ┃ ┃ ┃ ┃ ┣ 📜RecentOrders.tsx
 ┃ ┃ ┃ ┃ ┗ 📜StatsCard.tsx
 ┃ ┃ ┃ ┣ 📂OrderManager
 ┃ ┃ ┃ ┃ ┣ 📜OrderStatusUpdate.tsx
 ┃ ┃ ┃ ┃ ┗ 📜OrderTable.tsx
 ┃ ┃ ┃ ┣ 📂ProductManager
 ┃ ┃ ┃ ┃ ┣ 📜ImageUpload.tsx
 ┃ ┃ ┃ ┃ ┣ 📜ProductForm.tsx
 ┃ ┃ ┃ ┃ ┗ 📜ProductTable.tsx
 ┃ ┃ ┃ ┗ 📂UserManager
 ┃ ┃ ┃ ┃ ┣ 📜RoleSelector.tsx
 ┃ ┃ ┃ ┃ ┗ 📜UserTable.tsx
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┣ 📜useAdminOrders.ts
 ┃ ┃ ┃ ┣ 📜useAdminProducts.ts
 ┃ ┃ ┃ ┗ 📜useAdminUsers.ts
 ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┗ 📜authApi.ts
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜ForgotPassword.tsx
 ┃ ┃ ┃ ┣ 📜LoginForm.tsx
 ┃ ┃ ┃ ┗ 📜RegisterForm.tsx
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┣ 📜useAuth.ts
 ┃ ┃ ┃ ┗ 📜useAuthRedirect.ts
 ┃ ┃ ┣ 📂types
 ┃ ┃ ┃ ┗ 📜auth.types.ts
 ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂cart
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┗ 📜cartApi.ts
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📂CartItem.tsx
 ┃ ┃ ┃ ┣ 📜CartDrawer.tsx
 ┃ ┃ ┃ ┣ 📜CartSummary.tsx
 ┃ ┃ ┃ ┗ 📜EmptyCart.tsx
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┗ 📜useCart.ts
 ┃ ┃ ┣ 📂types
 ┃ ┃ ┃ ┗ 📜cart.type.ts
 ┃ ┃ ┗ 📜index.ts
 ┃ ┣ 📂orders
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┗ 📜orderApi.ts
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📂OrderCard
 ┃ ┃ ┃ ┃ ┣ 📜OrderCard.css
 ┃ ┃ ┃ ┃ ┗ 📜OrderCard.tsx
 ┃ ┃ ┃ ┣ 📜CheckoutForm.tsx
 ┃ ┃ ┃ ┣ 📜OrderDetails.tsx
 ┃ ┃ ┃ ┣ 📜OrderHistory.tsx
 ┃ ┃ ┃ ┗ 📜OrderStatus.tsx
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┣ 📜useCheckout.ts
 ┃ ┃ ┃ ┗ 📜useOrders.ts
 ┃ ┃ ┣ 📂types
 ┃ ┃ ┃ ┗ 📜order.types.ts
 ┃ ┃ ┗ 📜index.ts
 ┃ ┗ 📂products
 ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┗ 📜productApi.ts
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📂ProductCard
 ┃ ┃ ┃ ┃ ┣ 📜ProductCard.css
 ┃ ┃ ┃ ┃ ┗ 📜ProductCard.tsx
 ┃ ┃ ┃ ┣ 📜CategoryFilter.tsx
 ┃ ┃ ┃ ┣ 📜ProductDetails.tsx
 ┃ ┃ ┃ ┣ 📜ProductGrid.tsx
 ┃ ┃ ┃ ┣ 📜PruductList.tsx
 ┃ ┃ ┃ ┗ 📜SearchBar.tsx
 ┃ ┃ ┣ 📂hooks
 ┃ ┃ ┃ ┣ 📜useProductDetails.ts
 ┃ ┃ ┃ ┗ 📜useProducts.ts
 ┃ ┃ ┣ 📂types
 ┃ ┃ ┃ ┗ 📜product.types.ts
 ┃ ┃ ┗ 📜index.ts
 ┣ 📂hooks
 ┃ ┣ 📜useLocalStorage.ts
 ┃ ┣ 📜useTheme.ts
 ┃ ┗ 📜useToast.ts
 ┣ 📂models
 ┃ ┣ 📜api.model.ts
 ┃ ┣ 📜cart.model.ts
 ┃ ┣ 📜common.model.ts
 ┃ ┣ 📜order.model.ts
 ┃ ┣ 📜product.model.ts
 ┃ ┣ 📜ui.model.ts
 ┃ ┗ 📜user.model.ts
 ┣ 📂pages
 ┃ ┣ 📂admin
 ┃ ┃ ┣ 📜Dashboard.tsx
 ┃ ┃ ┣ 📜OrderManagement.tsx
 ┃ ┃ ┣ 📜ProductManagement.tsx
 ┃ ┃ ┗ 📜UserManagement.tsx
 ┃ ┣ 📂Home
 ┃ ┃ ┣ 📜Home.css
 ┃ ┃ ┗ 📜Home.tsx
 ┃ ┣ 📜Cart.tsx
 ┃ ┣ 📜Checkout.tsx
 ┃ ┣ 📜Login.tsx
 ┃ ┣ 📜NotFound.tsx
 ┃ ┣ 📜OrderDetails.tsx
 ┃ ┣ 📜OrderHistory.tsx
 ┃ ┣ 📜ProductDetails.tsx
 ┃ ┣ 📜Profile.tsx
 ┃ ┗ 📜Register.tsx
 ┣ 📂routes
 ┃ ┣ 📜AdminRoute.tsx
 ┃ ┣ 📜AppRoutes.tsx
 ┃ ┣ 📜paths.ts
 ┃ ┗ 📜ProtectedRoute.tsx
 ┣ 📂services
 ┃ ┣ 📜authServes.ts
 ┃ ┣ 📜notificationService.ts
 ┃ ┣ 📜storageService.ts
 ┃ ┗ 📜validationService.ts
 ┣ 📂store
 ┃ ┣ 📜authStore.ts
 ┃ ┣ 📜cartStore.ts
 ┃ ┗ 📜uiStore.ts
 ┣ 📂styles
 ┃ ┗ 📜variables.css
 ┣ 📂utils
 ┃ ┣ 📜formatters.ts
 ┃ ┣ 📜helpers.ts
 ┃ ┗ 📜validators.ts
 ┣ 📜index.css
 ┗ 📜main.tsx