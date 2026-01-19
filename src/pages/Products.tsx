import { useSearchParams } from "react-router-dom";
import "./Products.css";

const Products = () => {
  const [params] = useSearchParams();
  const searchTerm = params.get("search") || "";

  return (
    <div className="products-page">
      <h1>Products</h1>
      {searchTerm && <p>Showing results for: <strong>{searchTerm}</strong></p>}
    </div>
  );
};

export default Products;