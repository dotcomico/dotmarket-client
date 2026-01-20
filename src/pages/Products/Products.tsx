import "./Products.css";
import { PATHS } from "../../routes/paths";
import { Link } from "react-router-dom";
import { useState } from "react";

const Products = () => {
  const [categoryName, setCategoryName] = useState('d');
  const [searchTerm, setsearchTerm] = useState('banana');

  return (
    <div className="products-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to={PATHS.HOME}>Home</Link>
        <span> / </span>
        {categoryName && <span>{categoryName}</span>}
      </nav>

      {/* Category Header */}
      {categoryName && (
        <div className="category-header">
          <h1>{categoryName}</h1>
        </div>
      )}

      {searchTerm && (
        <p className="search-info">
          Showing results for: <strong>{searchTerm}</strong>
        </p>
      )}
</div>
  );
};

export default Products;