import { Link } from 'react-router-dom';
import type { Category } from '../../types/category.types';
import './CategoryCard.css';
import { buildPath } from '../../../../routes/paths';

interface CategoryCardProps {
  category: Category;
  variant?: 'horizontal' | 'grid' | 'compact';
}

export const CategoryCard = ({ category, variant = 'horizontal' }: CategoryCardProps) => {

  return (
    <Link
      to={buildPath.categoryDetail(category.slug)}
      className={`category-card category-card--${variant}`}
    >
      <div className='category-card__image-container'>
        {category.image ? (
          <img src={category.image} alt={category.name} />
        ) : (
          <div className="category-card__placeholder">
            {category.icon || '📦'}
          </div>
        )}
      </div>
      <h3>{category.name}</h3>
    </Link>
  );
};