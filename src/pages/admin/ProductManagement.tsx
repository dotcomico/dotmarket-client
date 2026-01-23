import { AdminHeader } from '../../components/admin/AdminHeader/AdminHeader';
import { AdminSidebar } from '../../components/admin/AdminSidebar/AdminSidebar';
import { useProductStore } from '../../features/products';
import './ProductManagement.css';

const ProductManagement = () => {
  const { products, fetchProducts } = useProductStore();

  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-layout__content">
        <AdminHeader title="Product Management" />
        
        <main className="admin-main">
          <div className="admin-card">
            <div className="product-management-header">
              <h2>Product Catalog</h2>
              <button className="btn-primary">+ New Product</button>
            </div>

            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="search-input"
              />
            </div>

            <p style={{ color: 'var(--secondary-text)' }}>
              Connected to product store. {products.length} products loaded.
            </p>
            {/* Add ProductTable component here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductManagement;