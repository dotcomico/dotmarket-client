import { CategoryList } from "../../features/categories"
import './Categorys.css'

const Categorys = () => {
  return (
    <div className="categorys">
        <CategoryList variant="grid" limit={100} showChildren={false} />
        </div>
  )
}

export default Categorys