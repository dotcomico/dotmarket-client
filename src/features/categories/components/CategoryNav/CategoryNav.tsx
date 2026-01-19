import { useCategoryStore } from '../../categoryStore';
import './CategoryNav.css';

export const CategoryNav = () => {
  const { categories } = useCategoryStore();

  return (
    <nav className="category-nav">
      {categories.map(category => (
        <a key={category.id} href={`/categories/${category.slug}`}>
          {category.icon && <span className="category-nav__icon">{category.icon}</span>}
          {category.name}
        </a>
      ))}
    </nav>
  );
};