import { useEffect } from 'react';
import { useCategoryStore } from '../../categoryStore';
import { CategoryCard } from '../CategoryCard/CategoryCard';
import './CategoryCarousel.css';

export const CategoryCarousel = () => {
  const { categories, isLoading, error, fetchCategories } = useCategoryStore();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  if (isLoading) return <div className="category-carousel__loading">טוען קטגוריות...</div>;
  if (error) return <div className="category-carousel__error">{error}</div>;

  return (
    <section className="category-carousel">
      <h2>קטגוריות פופולריות</h2>
      <div className="category-carousel__scroll">
        {categories.map(category => (
          <CategoryCard 
            key={category.id} 
            category={category} 
            variant="horizontal" 
          />
        ))}
      </div>
    </section>
  );
};