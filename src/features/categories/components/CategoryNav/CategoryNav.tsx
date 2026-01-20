import { Link } from 'react-router-dom';
import { useCategoryStore } from '../../categoryStore';
import { buildPath } from '../../../../routes/paths';
import './CategoryNav.css';

export const CategoryNav = () => {
  const { categories } = useCategoryStore();

  return (
    <nav className="category-nav">
      {categories.map(category => (
        <Link
          key={category.id}
          // to={`/categories/${category.slug}/products`}
          to={buildPath.categoryDetail(category.slug)}
        >
          {category.icon && <span className="category-nav__icon">{category.icon}</span>}
          {category.name}
        </Link>
      ))}
    </nav>
  );
};