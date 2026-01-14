import { CategoryList } from '../features/categories'

const Categorys = () => {
  return (
    <div>
        Categorys
        <CategoryList variant="grid" limit={100} showChildren={false} />
        </div>
  )
}

export default Categorys