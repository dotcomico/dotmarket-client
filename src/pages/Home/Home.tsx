import React from 'react'
import "./Home.css";
import {  CategoryCarousel, CategoryNav } from '../../features/categories';
import { CategoryList } from '../../features/categories/components/CategoryList/CategoryList';

const Home = () => {
  return (
    <div className='Home'>
      <CategoryCarousel />
      <CategoryNav />
      <CategoryList variant="grid" limit={8} />
    </div>
  )
}

export default Home