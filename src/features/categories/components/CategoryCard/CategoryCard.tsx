import { Link } from 'react-router-dom';
import type { Category } from '../../types/category.types';
import './CategoryCard.css';

interface CategoryCardProps {
  category: Category;
  variant?: 'horizontal' | 'grid' | 'compact';
}

export const CategoryCard = ({ category, variant = 'grid' }: CategoryCardProps) => {
  return (
    <Link 
      to={`/categories/${category.slug}`} 
      className={`category-card category-card--${variant}`}
    >
      {category.image ? (
        <img src={category.image} alt={category.name} />
      ) : (
        <div className="category-card__placeholder">
          {category.icon || '📦'}
        </div>
      )}
      <h3>{category.name}</h3>
    </Link>
  );
};