import { useEffect } from "react";
import "./Home.css";
import { CategoryList } from '../../features/categories';
import { ProductGrid, useProductStore } from "../../features/products";
import { HeroBanner, NewArrivals, TrustStrip, useNewArrivals } from "../../features/home";

const Home = () => {
  const { products, isLoading, fetchProducts } = useProductStore();
  const { arrivals, isLoading: isLoadingArrivals } = useNewArrivals();

  const arrivalIds = new Set(arrivals.map((product) => product.id));
  const gridProducts = products.filter((product) => !arrivalIds.has(product.id));

  useEffect(() => {
    fetchProducts({ limit: 1000 }); // Fetch all products
  }, [fetchProducts]);

  return (
    <div className='Home'>
      <HeroBanner />
      <TrustStrip />
      <CategoryList variant="grid" limit={100} showChildren={false} />
      <NewArrivals products={arrivals} isLoading={isLoadingArrivals} />
      <ProductGrid 
        products={gridProducts} 
        isLoading={isLoading}
        limit={20}
        showMoreEnabled={true}
        showMoreLabel="Load More Products"
      />
    </div>
  );
};

export default Home;