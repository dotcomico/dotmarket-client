import { useEffect } from "react";
import "./Home.css";
import { CategoryList } from '../../features/categories';
import { ProductGrid, getProductStockStatus, useProductStore } from "../../features/products";
import type { Product } from "../../features/products";
import { HeroBanner, ProductRow, TrustStrip, selectAlmostGone, useNewArrivals } from "../../features/home";
import { UI_STRINGS } from "../../constants/uiStrings";

const getStockLabel = (product: Product) => getProductStockStatus(product).label;

const Home = () => {
  const { products, isLoading, fetchProducts } = useProductStore();
  const { arrivals, isLoading: isLoadingArrivals } = useNewArrivals();

  // Waiting on arrivals too: on return from a category page the first render still has
  // that category in the store, before the catalogue fetch has set isLoading.
  const almostGone = isLoading || isLoadingArrivals ? [] : selectAlmostGone(products);

  useEffect(() => {
    fetchProducts({ limit: 1000 }); // Fetch all products
  }, [fetchProducts]);

  return (
    <div className='Home'>
      <HeroBanner />
      <TrustStrip />
      <CategoryList variant="grid" limit={100} showChildren={false} />
      <ProductRow
        title={UI_STRINGS.HOME.NEW_ARRIVALS.TITLE}
        subtext={UI_STRINGS.HOME.NEW_ARRIVALS.SUBTEXT}
        products={arrivals}
        isLoading={isLoadingArrivals}
        headingId="new-arrivals-heading"
      />
      <ProductRow
        title={UI_STRINGS.HOME.ALMOST_GONE.TITLE}
        subtext={UI_STRINGS.HOME.ALMOST_GONE.SUBTEXT}
        products={almostGone}
        isLoading={false}
        headingId="almost-gone-heading"
        getItemNote={getStockLabel}
      />
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