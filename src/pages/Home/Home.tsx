import { useEffect } from "react";
import "./Home.css";
import { CategoryList } from '../../features/categories';
import { ProductGrid, useProductStore } from "../../features/products";

const Home = () => {
  const { products, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts({ limit:1  });
    }
  }, [products.length, fetchProducts]);

  return (
    <div className='Home'>
      <CategoryList variant="grid" limit={9} showChildren={false} />
      <ProductGrid products={products} isLoading={isLoading} />
    </div>
  );
};

export default Home;