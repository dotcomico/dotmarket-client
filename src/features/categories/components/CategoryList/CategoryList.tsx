import { useEffect } from 'react';
import { useCategoryStore } from '../../categoryStore';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import './CategoryList.css';

interface CategoryListProps {
  variant?: 'grid' | 'list';
  showChildren?: boolean;
  limit?: number;
}

export const CategoryList = ({ 
  variant = 'grid', 
  showChildren = false,
  limit 
}: CategoryListProps) => {
  const { categories, isLoading, error, fetchCategories } = useCategoryStore();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  if (isLoading) {
    return (
      <div className="category-list__loading">
        <div className="spinner" />
        <p>טוען קטגוריות...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-list__error">
        <p>❌ {error}</p>
        <button onClick={fetchCategories}>נסה שוב</button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="category-list__empty">
        <p>אין קטגוריות זמינות</p>
      </div>
    );
  }

  const displayCategories = limit ? categories.slice(0, limit) : categories;

  return (
    <section className="category-list">
      <h2>כל הקטגוריות</h2>
      
      <div className={`category-list__container category-list__container--${variant}`}>
        {displayCategories.map(category => (
          <div key={category.id} className="category-list__item">
            <CategoryCard 
              category={category} 
              variant={variant === 'list' ? 'horizontal' : 'grid'} 
            />
            
            {/* תת-קטגוריות (אם יש) */}
            {showChildren && category.children && category.children.length > 0 && (
              <div className="category-list__children">
                {category.children.map(child => (
                  <CategoryCard 
                    key={child.id} 
                    category={child} 
                    variant="compact" 
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};