import "./Home.css";
import { CategoryList } from '../../features/categories';

const Home = () => {
  return (
    <div className='Home'>
    
    
      <CategoryList variant="grid" limit={9} showChildren={false} />
      
    </div>
  )
}

export default Home