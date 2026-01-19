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

  if (isLoading) return <div className="category-carousel__loading">Loading categorys...</div>;
  if (error) return <div className="category-carousel__error">{error}</div>;

  return (
    <section className="category-carousel">
      <h2>Popular categories</h2>
      <div className="category-carousel__scroll">
        {categories.map(category => (
          <CategoryCard 
            key={category.id} 
            category={category} 
            variant="grid" 
          />
        ))}
      </div>
    </section>
  );
};