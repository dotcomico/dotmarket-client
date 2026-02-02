import { useEffect } from "react";
import "./Home.css";
import { CategoryList } from '../../features/categories';
import { ProductGrid, useProductStore } from "../../features/products";

const Home = () => {
  const { products, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts({ limit: 1000 }); // Fetch all products
    }
  }, [products.length, fetchProducts]);

  return (
    <div className='Home'>
      <CategoryList variant="grid" limit={100} showChildren={false} />
      <ProductGrid 
        products={products} 
        isLoading={isLoading}
        limit={20}
        showMoreEnabled={true}
        showMoreLabel="Load More Products"
      />
    </div>
  );
};

export default Home;